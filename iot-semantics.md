---
noheader: true
---

<p style="color:crimson;font-weight:bold;">Warning: page in construction!<p>

# Hands-On Introduction to Semantic Interoperability

_Step-by-step tutorial to Semantic Web technologies with focus on
interoperability in the Internet of Things (IoT)._

The tutorial revolves around the idea that every participant builds their own
semantic model of the conference room they will be sitting in. They will be
invited to model in terms of object classes and relationship between them the
features they consider of interest like room dimensions, the furniture and
digital equipment it contains, the various physical properties that can be
measured in it, etc. At the end of the tutorial, the expected result is a
browsable graph of interlinked classes with alignments across different models
(sub-class relation- ships, attribute references, equivalences, etc.). As a
baseline, different models extracted from oneM2M, OCF and OMA LWM2M schema
definitions will be available.

The tutorial is organized in four phases:
1. First, after setting up the tools required for the tutorial, participants
create a model using the GraphQL schema language, a generic language sharing
many features with C and Java.
2. Participants can use a command-line tool to transform their GraphQL
schema into a semantic model defined as a schema.org extension. Then,
participants can register the output semantic model on a server that generates
an HTML documentation of their model. A good documentation
of each term should be provided for later alignment.
3. After a brief introduction to semantics and the concept of interpretation,
participants can experiment with the result of applying different semantics
to their model: F-logic (the implicit semantics of the GraphQL query
language), RDFS and OWL DL.
4. Participants are asked to browse others' models and try to find possible
alignments with theirs. Alignments are defined via a Web form.

First, please provide a SPARQL endpoint URI to use throughout the tutorial:

<input type="url" placeholder="e.g. http://192.168.X.X/sparql"></input>

## GraphQL Schema Definition

[GraphQL](http://facebook.github.io/graphql/June2018/) offers a convenient
way to define a type system based on class and property definitions in a
language-agnostic fashion.

Take the point of view of a system engineer that must define a Building
Automation System (BAS) for the room in which you are currently sitting
(most likely a conference room). A BAS typically has the following
functions:
 - ventilation and humidity control
 - heating and temperature regulation
 - lighting control
 - energy management

Define a GraphQL schema for all features you consider relevant for
BAS engineering:

<div class="language-graphql highlighter-rouge">
  <textarea cols="80"></textarea>
</div>

## From GraphQL to Schema.org

GraphQL schemas are meant to be exchanged between a client and a server
to validate queries and data updates (called "mutations"). However, the GraphQL
specification assumes all clients know in advance the location of the schema
the server implements, often exposed as a Web resource by the same server.
Here, we will use the W3C Resource Description Framework (RDF) to expose your
BAS-related schema.

[Schema.org](http://schema.org/) is a widespread semantic model rooted in
RDF to annotate Web pages to improve information retrieval on the Web. In this
tutorial, we will use its meta-vocabulary to publish your schema using standard
Semantic Web technologies.

First, your GraphQL schema must be turned into RDF (using the schema.org
meta-vocabulary). This step is automatic.

<button>Transform</button>

Then, the output of this transformation (an RDF vocabulary) can be published
on the (Semantic) Web via a SPARQL endpoint.

<button>Publish</button>

Now, you can browse the generated HTML documentation for your vocabulary.

<a href="">Link</a>

## Introduction to Model Theoretical Semantics

Semantic models are data models that have formally defined _semantics_.
Roughly, the semantics of a model help determine if this model is logically
consistent and if implicit statements can be inferred from it. There
exists several formalisms to define the semantics of a data model.

Semantic Web technologies mostly rely on formalisms that obey the principles
of _Model Theory_ that defines the concept of _interpretation_. In short,
an interpretation is a function that map statements defined in a model to
an arbitrary set of symbols (a _domain of interpretation_). The semantics
of a data model is provided in the form of constraints over an interpretation
function, regardless of its domain of interpretation.

In this tutorial, we will review the following formalisms:
 - F-logic
 - RDF Schema
 - OWL DL (Description Logic)

## Semantic Alignment

Basic alignments:
 - `C subClassOf D`
 - `p subPropertyOf q`
 - `C subClassOf E`, `D subClassOf E`
 - `p subPropertyOf r`, `q subPropertyOf r`
 - `C equivalentClass D`
 - `p equivalentProperty q`

_This tutorial was first presented during the [8th International Conference on
the Internet of Things (IoT 2018)](http://www.iot-conference.org/)_