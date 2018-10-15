---
noheader: true
---

<p style="color:crimson;font-weight:bold;">
  Warning: page under construction!
</p>

To do:
 - link for an intro to RDF?
 - more IoT-related example of schema.org?
 - add links to the software we used
 - add link to the IoT paper

# Hands-On Introduction to Semantic Interoperability

_Step-by-step tutorial on Semantic Web technologies with focus on
interoperability in the Internet of Things (IoT). Duration: 2h._

This tutorial aims mostly at software developers and IoT practitioners who face
the problem of having to deal with highly heterogeneous data and seek solutions
to make IoT systems more _interoperable_. The approach we present here borrows
from the successful [schema.org](http://schema.org/) community, which develops
a curated vocabulary for content annotation on the Web. We will essentially
extend schema.org to provide IoT-specific terms.

## Overview

The tutorial is organized in four phases:

1. [Model a data schema for Building Automation](#a-data-schema-for-building-automation)
2. [Publish your data schema](#publishing-schemas-on-the-web)
3. [Align semantically with other data schemas](#semantic-alignment)
4. [Get an introduction to inference and semantics](#introduction-to-model-theoretical-semantics)

This tutorial is interactive and requires a Web server to store data schemas
and generate browsable documentation. Please enter in the field below the
server endpoint to use for this session:

<p>
  <div style="width:100%;display:inline-block;">
    <input id="sparql-input" style="width:100%;display:block;" class="message input" type="url" placeholder="e.g. http://localhost/"/>
  </div>
  <small>
    What is this? This URI points to a
    <a href="https://www.w3.org/TR/2013/REC-sparql11-overview-20130321/">SPARQL</a>
	endpoint, a standard interface to expose and query semantic data on the Web. 
  </small>
</p>

## A Data Schema for Building Automation

Every IoT agent, like sensors, industrial controllers and humans, have their
own _domain model_, which only includes certain aspects of the physical world,
relevant to them. This leads to heterogeneity in terms of granularity, type
system or data representation. However, heterogeneity is inevitable in
large-scale systems that involve many agents. Building Automation (BA) systems,
built in large buildings like conference centers or offices, involve thousands
of automation devices and as many humans. Here are some of the features a BA
system implements:
 - ventilation and humidity control
 - heating and temperature regulation
 - lighting control
 - energy management

If agents are actual software agents, then their domain model typically
expresses that of the engineers that designed them. Take the point of
view of a BA engineer and think of the features of the room you are currently
in (most likely a conference room) that need to be exchanged and processed by
IoT agents. You will model these features as a _data schema_ in the form of
class and property definitions, very much like in an object-oriented
programmation framework. [GraphQL](http://facebook.github.io/graphql/June2018/)
offers a convenient way to define such a schema in a language-agnostic fashion.
Here are the GraphQL types we will use:

| Keyword | Name | Example |
| --- | --- | --- |
| `interface` | (Java-like) Interface | `interface I { p: String ... }` |
| `type` | Object type | `type T implements I { p: Tp ... }` |
| `union` | Union type | `union T = T1 | T2` |
| `scalar` | Scalar type | `scalar T` |
| `enum` | Enumeration type | `enum E { E1 E2 ... }` |

Take five minutes to have a look at the GraphQL syntax (e.g.
[on graphql.org](https://graphql.org/graphql-js/object-types/) or
[on Github](https://github.com/sogko/graphql-schema-language-cheat-sheet))
and define a GraphQL schema for all features you consider relevant for BA
engineering. The schema you design here will later be published on the Web, for
the time of the tutorial:

<p>
  <!-- See /misc/bas-schema.txt for an example -->
  <div id="graphql-text" style="height: 500px;"></div>
</p>

## Publishing Schemas on the Web

GraphQL schemas are meant to be published by a Web server and consumed by
clients to validate queries and data updates (called "mutations"). However, as
we will see later, the GraphQL specification offers quite limited features for
semantic alignment and integration between different schemas. In the following,
we will extend your GraphQL schema with elements of the [W3C Resource
Description Framework (RDF)](), a major technology for semantic
interoperability on the Web.

Schema.org itself relies on RDF. It is a collection of class and property
definitions, each referenced by a URI and accessible on the Web. Have a
look e.g. at the class definition
[http://schema.org/Place](http://schema.org/Place) or the property
definition [http://schema.org/location](http://schema.org/location). You can
browse the schema.org vocabulary by following links. You will probably notice
that the structure of schema.org looks very much like GraphQL: classes have
properties (classes are the _domain_ of these properties) and each property has
an expected type (the _range_ of the property).

We implemented a straightforward transformation from GraphQL to schema.org (and
RDF) so that your GraphQL schema can be published as RDF.

<p>
  <div style="width:100%">
    <div style="width:33%;display:inline-block;">
      <span id="transform-button" style="display:block;" class="button">TRANSFORM</span>
    </div>
    <div style="width:66%;display:inline-block;">
      <span id="transform-msg" style="display:block;" class="message"></span>
    </div>
  </div>
  <small>
    See the transformation script  <a href="/js/graphql2rdf.js">graphql2rdf.js</a>
    for more details.
  </small>
</p>

<pre style="max-height:200px;">
  <code id="transform-out">...</code>
</pre>

The output of this transformation is an RDF vocabulary, encoded in a JSON
format for RDF ([JSON-LD](http://www.w3.org/TR/json-ld/)). The standard
procedure is to publish it on the Web and provide a human-readable
documentation for it. We wrote a small Web server that automatically generates
documentation in the same style as schema.org. Publish your vocabulary on this
server and have a look at the generated documentation:

<p>
  <div style="width:100%">
    <div style="width:33%;display:inline-block;">
      <span id="publish-button" style="display:block;" class="button">PUBLISH</span>
    </div>
    <div style="width:66%;display:inline-block;">
      <span id="publish-msg" style="display:block;" class="message"></span>
    </div>
  </div>
</p>

If you know the namespace under which other participants published their own
model, you can start browsing their vocabulary the same way and identify
commonalities. By doing so, you might notice that some of the terms others have
come up with are not self-explanatory. For this reason, it is a good practice
to document every term with a textual description, very much like documenting
source code. GraphQL also provides means to textually describe classes and
properties. If you have time, add text wherever is appropriate and re-publish
your vocabulary.

In the following, we will define equivalences between your schema and
what other participants produced. To that purpose, we will use the following
two formalisms, rooted in RDF, which are meant for semantic modeling:
 - the [RDF Schema (RDFS) language](http://www.w3.org/TR/rdf-schema/)
 - the [Web Ontology Language (OWL)](https://www.w3.org/TR/owl2-overview/),
   which is a superset of RDFS
   
The process of finding equivalences is usually called semantic _alignment_.

## Semantic Alignment

RDFS and OWL provide four terms to align type and property definitions
(names should be self-explanatory):
 - `subClassOf`
 - `subPropertyOf`
 - `equivalentClass`
 - `equivalentProperty`

On this basis, given the types `T`, `Tp` and the properties `p`, `pp`,
the following alignments can be defined (we use the same syntax as above,
JSON-LD).

1. `T` has the same properties as `Tp` and more:
```
{
  "@id": "T",
  "subClassOf": "Tp"
}
```

2. `T` and `Tp` have exactly the same properties:
```
{
  "@id": "T",
  "equivalentClass": "Tp"
}
```

3. A subset of the properties of `T` and `Tp` are common but not all:
```
[{
  "@id": "T",
  "subClassOf": "Ts"
}, {
  "@id": "Tp",
  "subClassOf": "Ts"
}]
```

4. `p` is used for the same classes as `pp` and more:
```
{
"@id": "p",
"subPropertyOf": "pp"
}
```

5. `p` is used for exactly the same classes as `pp`:
```
{
"@id": "p",
"equivalentProperty": "pp"
}
```

6. the domain and range of `p` and `pp` overlap but only partially:
```
[{
"@id": "p",
"subPropertyOf": "ps"
}, {
"@id": "pp",
"subPropertyOf": "ps"
}]
```

You can see that we introduced `Ts` and `ps`. Feel free to add as many
intermediate definitions as needed. Try to formulate alignments for your schema
and add them to your published vocabulary:

<p>
  <!-- See /misc/bas-alignment.jsonld for examples -->
  <div id="jsonld-text" style="height: 200px;"></div>
</p>

<p>
  <div style="width:100%">
    <div style="width:33%;display:inline-block;">
      <span id="align-button" style="display:block;" class="button">ADD</span>
    </div>
    <div style="width:66%;display:inline-block;">
      <span id="align-msg" style="display:block;" class="message"></span>
    </div>
  </div>
</p>

In real-world scenarii, when semantic interoperability is not considered in the
development of a software application, more complex approaches must be found to
express equivalences between differing domain models. We experimented with the
models of three IoT standards:
 - [OMA Lightweight M2M (LWM2M) by the Open Mobile Alliance](http://openmobilealliance.hs-sites.com/lightweight-m2m-specification-from-oma)
 - [specifications by the Open Connectiviy Foundation (OCF)](https://openconnectivity.org/)
 - [oneM2M](http://www.onem2m.org/)

We developed [an approach based on SPARQL inference rules](), generated
semi-automatically. Another (simpler) approach is to provide alignments with a
reference model, such as [iot.schema.org](https://iot.schema.org/). This
requires, however, to integrate it into the software development process of IoT
applications, which most do not. Other relevant vocabularies include the
[Sensor, Observation, Sample and Actuator (SOSA) vocabulary](https://www.w3.org/TR/vocab-ssn/)
and, for the modeling of rooms and BA systems, the
[Industry Foundation Class (IFC) ontology](http://openbimstandards.org/standards/ifcowl/),
vocabularies from the W3C Linked Building Data group like the
[Building Topology Ontology (BOT)](https://w3c-lbd-cg.github.io/bot/), as well
as the [Brick schema](http://brickschema.org/).

RDFS and OWL provide different levels of expressiveness. Think for instance of
the following cases:
 1. rooms are 'part of' floors and floors are 'part of' buildings
 2. if any entity <math>x</math> is 'part of' another entity <math>y</math>,
   then <math>y</math> 'is composed of' <math>x</math>
 3. in some countries, counting floors starts at 0, in other it starts at 1
 4. adjacent rooms must be on the same floor

In RDFS, a property is a first-class citizen, its defintion can be reused for
different type definitions (case 1). OWL properties can be defined as the
_inverse properties_ of some other property (case 2). Restrictions on literal
types like strings or number are also supported by OWL (case 3), as well as
logical restrictions on type instances (case 4).

And then, what? Computing equivalence relations between domain models can be
performed transparently by means of automated reasoning. To understand how
reasoning works, we will need to give a few details on the theoretical
foundations of semantics.

## Introduction to Model Theoretical Semantics

_Warning: theoretical discussion ahead._

Every programming or modeling language defines a _syntax_ and a _semantics_.
The syntax of a language defines how to formulate valid sentences. For
instance, the sentence "A conference room is a spatial entity." is a valid
English sentence but "Spatial a conference is" is not. A syntax is often
provided by means of a grammar. In contrast, the semantics of a language
defines the meaning of all possible sentences allowed in the language. In
natural language, semantics is simply what makes all of us understand each
other. The meaning of a sentence is not necessarily unique across languages:
the GraphQL statement `type ConferenceRoom implements SpatialEntity` has
roughly the same meaning as the English sentence above. For formal languages
(like GraphQL or RDF), there exist several ways to define semantics.
However, all of them rely on the notion of _inference_.

Inference is a reasoning procedure that establishes whether a given sentence
is the logical consequence of other sentences. For instance, one can infer
that a conference room has a surface from the sentence "A conference
room is a spatial entity." and "Every spatial entity has a surface".
Let <math>a, b</math> be the latter two sentences and <math>c</math> the
inferred statement, inference is usually denoted <math>{a,b}⊨ c</math>.
Classical logic formalisms define semantics in terms of
rules but model theoretical semantics has a slightly different, rationale
somewhat more intuitive. _Model theory_ relies on the assumption that every
agent capable of reasoning builds an internal _model_ of a sentence, i.e. a
combination of arbitrary symbols, unique for every agent. This process is
called _interpretation_ and the set of symbols an agent uses is called _domain
of interpretation_. When the inference <math>{a,b} ⊨ c</math> occurs, it means
that every model of <math>a</math> and <math>b</math> includes the model
of <math>c</math>, _regardless_ of the agent's domain of interpretation.

The semantics of a language are then given as constraints on models. Here is an
example of (model theoretical) semantics for GraphQL types:

| Sentence | Semantics |
| --- | --- |
| `type T` | set of symbols <math><msub><mi>S</mi><mn>T</mn></msub></math> |
| `type T { p: Tp }` | <math>∀ x ⋲ <msub><mi>S</mi><mn>T</mn></msub>, p(x) ⋲ <msub><mi>S</mi><mn>T'</mn></msub></math> |
| `type T implements I'`  | <math><msub><mi>S</mi><mn>I</mn></msub> ⊆ <msub><mi>S</mi><mn>T</mn></msub></math> |
| `union T = Tp | Ts`     | <math><msub><mi>S</mi><mn>T</mn></msub> = <msub><mi>S</mi><mn>T'</mn></msub> ⋃ <msub><mi>S</mi><mn>T''</mn></msub></math> |
| `enum E { E1, E2 }`     | <math><msub><mi>S</mi><mn>E</mn></msub> = { <msub><mi>x</mi><mn>1</mn></msub>, <msub><mi>x</mi><mn>2</mn></msub> }</math> |

In this setting, inference essentially boils down to set operations (you can
also note that class properties are defined as functions, which is inspired
by the reference semantics of object-oriented programming language called
_F-logic_).

In practice, there is not much one can infer from a GraphQL schema, which is
why its main developers did not bother to define formal semantics for it.
However, the notion of semantics is paramount to achieve interoperability in
the IoT. Indeed, it is only at the semantic level that two domain models have
equivalences. Think of domain model <math>A</math> that defines
`type ConferenceRoom` and model <math>B</math> that includes
`type MeetingRoom implements Room, ConferenceEquipped`: there should exist some
equivalences <math>Eq</math> such that <math>A ⋃ B ⋃ Eq ⊨ </math>
`type ConferenceRoom` ≡ `type MeetingRoom`, so that both models can be used
interchangeably.

We mentioned cross-language equivalences between English and GraphQL but most
semantic equivalences are defined within the same language: "A conference room
has a location in space" is yet another formulation for the same statement as
above. Semantic processing across languages requires translations, a possibly
complex procedure (think of natural language translation). It is best to have a
reference modeling language in the IoT to reduce the problem of
interoperability to the computation of equivalences in a given language.
GraphQL cannot express equivalences but RDF was designed for that purpose, it
has well studied model theoretical semantics. More precisely, RDFS and OWL
provide a wide range of expressiveness with various inference engine
implementations.

_This tutorial was first presented during the [8th International Conference on
the Internet of Things (IoT 2018)](http://www.iot-conference.org/)._

<!-- see /js/graphql2rdf.js for the original source file -->
<script type="text/javascript" src="/js/graphql2rdf.bundle.js"></script>

<script type="text/javascript" src="/js/ace.js"></script>
<script type="text/javascript" src="/js/ace-mode-graphqlschema.js"></script>
<script type="text/javascript" src="/js/ace-mode-json.js"></script>
<script type="text/javascript" src="/js/ace-theme-tomorrow.js"></script>

<script type="text/javascript">
const graphql2rdf = require('graphql2rdf');

const si = document.getElementById('sparql-input'),
      tb = document.getElementById('transform-button'),
	  tm = document.getElementById('transform-msg'),
	  to = document.getElementById('transform-out'),
	  pb = document.getElementById('publish-button'),
	  pm = document.getElementById('publish-msg'),
	  ab = document.getElementById('align-button'),
	  am = document.getElementById('align-msg'),
	  gt = ace.edit('graphql-text'),
	  jt = ace.edit('jsonld-text');

// TODO store to session storage to be persistant over refresh
let session = null;
let endpoint = null;
let vocab = null;

// graph URI constructed from endpoint URI and session number
const graph = function(ep, s) { return ep + '/ns' + s + '/'; };

// display feedback message 'msg' in HTML element 'e'
const feedback = function(e, msg) {
	e.classList.remove('ok', 'error');

	if (msg instanceof Error) {
		e.textContent = msg.message;
		e.classList.add('error');
	} else if (msg) {
		e.innerHTML = msg;
		e.classList.add('ok');
	} else {
		e.textContent = '';
	}
}

si.oninput = function(ev) {
	endpoint = si.value;
};

tb.onclick = function(ev) {
	try {
		if (endpoint == null) throw new Error('SPARQL endpoint not set (see above).');
		vocab = graphql2rdf.rdfVocabulary(gt.getValue(), graph(endpoint, session));
		feedback(tm, 'Success.');
		to.textContent = JSON.stringify({
			'@graph': vocab['@graph']
		}, null, 2); // 2-spaces indentation
	} catch (e) {
		console.error(e);
		feedback(tm, e);
	}
};

pb.onclick = function(ev) {
	try {
		if (endpoint == null) throw new Error('SPARQL endpoint not set (see above).');
		if (vocab == null) throw new Error('Vocabulary not available.');
		
		let g = graph(endpoint, session);
		let uri = endpoint + '?graph=' + g;
		let req = new Request(uri, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/ld+json' },
			body: JSON.stringify(vocab)
		});
		
		fetch(req)
			.then(function(resp) {
				if (resp.ok) {
					let n = vocab['@graph'][0];
					let a = '<a href="' + n['@id'] + '">for class ' + n['label'] + '</a>';
					feedback(pm, 'Success (see online documentation, e.g. ' + a + ').');
				} else {
					console.error(resp);
					feedback(pm, new Error('HTTP error: received ' + resp.status + '.'));
				}
			})
			.catch(function(e) {
				console.error(e);
				feedback(pm, e);
			});

		// re-init feedback message
		feedback(pm);
	} catch (e) {
		console.error(e);
		feedback(pm, e);
	}
};

ab.onclick = function(ev) {
	try {
		let j = JSON.parse(jt.getValue());
		j['@context'] = {
			'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
			'owl': 'http://www.w3.org/2002/07/owl#',
			// TODO add @vocab 
			'subClassOf': {
				'@id': 'rdfs:subClassOf',
				'@type': '@vocab'
			},
			'subPropertyOf': {
				'@id': 'rdfs:subPropertyOf',
				'@type': '@vocab'
			},
			'equivalentClass': {
				'@id': 'owl:equivalentClass',
				'@type': '@vocab'
			},
			'equivalentProperty': {
				'@id': 'owl:equivalentProperty',
				'@type': '@vocab'
			}
		};

		let uri = endpoint + '?default';
		let req = new Request(uri, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/ld+json' },
			body: JSON.stringify(j)
		});
		
		fetch(req)
			.then(function(resp) {
				if (resp.ok) {
					feedback(am, 'Success.');
				} else {
					console.error(resp);
					feedback(am, new Error('HTTP error: received ' + resp.status + '.'));
				}
			})
			.catch(function(e) {
				console.error(e);
				feedback(am, e);
			});

		// re-init feedback message
		feedback(am);
	} catch (e) {
		console.error(e);
		feedback(am, e);
	}
};

gt.setTheme('ace/theme/tomorrow');
gt.session.setMode('ace/mode/graphqlschema');

jt.setTheme('ace/theme/tomorrow');
jt.session.setMode('ace/mode/json');

session = Math.round(Math.random() * 65536);
</script>