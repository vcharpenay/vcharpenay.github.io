/**
 * Copyright (C) 2018 Victor Charpenay
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <https://www.gnu.org/licenses/>. 
 */

/**
 * Requires the GraphQL JS reference implementation
 * to get an abstract syntax tree (AST) from a GraphQL
 * document.
 *
 * See https://github.com/graphql/graphql-js
 */
const graphql = require('graphql/language');

/**
 * Returns true if the input GraphQL definition 'def' is that of a built-in
 * scalar type (Int, Float, String, Boolean or ID).
 */
function isBuiltIn(def) {
	return [
		'Int',
		'Float',
		'String',
		'Boolean',
		'ID'
	].indexOf(def.name.value) > -1;
}

/**
 * Returns a JSON-LD node object with the @id key only (referencing an RDF
 * resource) based on the input GraphQL definition object 'def'.
 * 
 * The definition name is interpreted as a relative URI and used as value
 * for @id.
 */
function rdfReference(def) {
	return { '@id': def.name.value };
}

/**
 * Returns a JSON-LD node object with an @id, label (rdfs:label) and
 * comment (rdfs:comment) based on the input GraphQL definition object 'def'.
 * This node object should be the main definintion of the corresponding RDF
 * resource.
 * 
 * The definition name is used as plain label and, if it exists, the
 * description of the definition is used as comment.
 */
function rdfEntity(def) {
	let e = rdfReference(def);

	e['label'] = def.name.value;
	e['comment'] = def.description ?
				   def.description.value :
				   '';
	
	return e;
}

/**
 * Returns a JSON-LD node object with @type Property (rdf:Property) based on
 * the input GraphQL definition object 'def'.
 *  
 * The input RDFS class definition 'c' is used to build a unique identifier by
 * concatenating its local name to the GraphQL field name in Camel case.
 */
function rdfProperty(def, c) {
	let p = rdfEntity(def);
	p['@type'] = 'Property';

	p['@id'] = c['@id'][0].toLowerCase()
			 + c['@id'].substring(1)
			 + p['@id'][0].toUpperCase()
			 + p['@id'].substring(1);

	return p;
}

/**
 * Returns a JSON-LD node object with @type Class (rdfs:Class) based on the
 * input GraphQL definition object 'def'. The following rules apply:
 * 
 * interface C { p: C' }  ->  C a rdfs:Class .
 *                            p a rdf:Property .
 *                            p schema:domainIncludes C .
 *                            p schema:rangeIncludes C' .
 * type C implements C'   ->  C rdfs:subClassOf C' .
 * union C = C1 | C2      ->  C1 rdfs:subClassOf C .
 *                            C2 rdfs:subClassOf C .
 * enum C { i1, i2 }      ->  C rdfs:subClassOf schema:Enumeration .
 *                            i1 a C .
 *                            i2 a C .
 * 
 * Array types and nullable types are ignored.
 */
function rdfsClass(def) {
	let c = rdfEntity(def);
	c['@type'] = 'Class';
	c['@reverse'] = {};
	
	switch (def.kind) {
		case 'ObjectTypeDefinition':
			if (def.interfaces) c['subClassOf'] = def.interfaces.map(rdfReference);
			// then process def as an interface type definition (no break statement)
		
		case 'InterfaceTypeDefinition':
			c['@reverse']['domainIncludes'] = def.fields.map(fieldDef => {
				let p = rdfProperty(fieldDef, c);
				
				// TODO include array and nullable annotation?
				let classDef = fieldDef.type.kind === 'NamedType' ?
				               fieldDef.type :
							   fieldDef.type.type;
				let range = rdfReference(classDef);
				p['rangeIncludes'] = isBuiltIn(classDef) ? range['@id'] : range;
				
				return p;
			});
			break;
			
		case 'UnionTypeDefinition':
			c['@reverse']['subClassOf'] = def.types.map(rdfReference);
			break;
			
		case 'EnumTypeDefinition':
			c['subClassOf'] = { '@id': 'Enumeration' };
			c['@reverse']['a'] = def.values.map(rdfEntity);
			break;

		// TODO case 'ScalarTypeDefinition' 
	}
	
	return c;
}

/**
 * Returns an RDF vocabulary based on the list of definitions contained in the
 * input GraphQL schema 'schema'.
 * 
 * The optional 'base' argument is a base URI, relative to which definition
 * names will resolve.
 */
function rdfVocabulary(schema, base) {
	let ast = graphql.parse(schema);
	
	let vocab = {
		'@context': {
			'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
			'schema': 'http://schema.org/',
			'a': 'rdf:type',
			'label': 'rdfs:label',
			'comment': 'rdfs:comment',
			'Class': 'rdfs:Class',
			'Property': 'rdf:Property',
			'subClassOf': 'rdfs:subClassOf',
			'subPropertyOf': 'rdfs:subPropertyOf',
			'domainIncludes': 'schema:domainIncludes',
			'rangeIncludes': {
				'@id': 'schema:rangeIncludes',
				'@type': '@vocab'
			},
			'Int': 'schema:Integer',
			'Float': 'schema:Number',
			'String': 'schema:Text',
			'Boolean': 'schema:Boolean',
			'ID': 'schema:URL', // note: loosely related
			'Enumeration': 'schema:Enumeration'
		},
		'@graph': ast.definitions.map(rdfsClass)
	};
	
	if (base) vocab['@context']['@base'] = base;
	return vocab;
}

/**
 * This file can be bundled with GraphQL.js using Browserify:
 * browserify graphql2rdf.js -o graphql2rdf.bundle.js -r graphql2rdf
 * 
 * See http://browserify.org
 */
exports.rdfVocabulary = rdfVocabulary;