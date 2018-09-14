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

function rdfReference(def) {
	return { '@id': def.name.value };
}

function rdfEntity(def) {
	let e = rdfReference(def);

	// TODO DataType labels are different	
	e['label'] = def.name.value;
	e['comment'] = def.description ?
	               def.description.value :
				   '';
	
	return e;
}

function rdfProperty(def) {
	let p = rdfEntity(def);
	p['@type'] = 'Property';
	
	return p;
}

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
				// TODO rename field if conflict with existing definitions
				let p = rdfProperty(fieldDef);
				
				let classDef = fieldDef.type.kind === 'NamedType' ?
				               fieldDef.type :
							   fieldDef.type.type;
				p['rangeIncludes'] = rdfReference(classDef);
				
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
	}
	
	return c;
}

function rdfVocabulary(graphQLSchema, base) {
	let ast = graphql.parse(graphQLSchema);
	
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
			'domainIncludes': 'schema:domainIncludes',
			'rangeIncludes': 'schema:rangeIncludes',
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

exports.rdfVocabulary = rdfVocabulary;