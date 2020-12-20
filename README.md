# To run:
* Use 'npm run server'.

# Assumptions
* Creation date is when the organization is first created. The POST endpoint will add creation date, but the PUT endpoint will not modify it.
* Creation date is not an input (but easily could be, although it would need to be checked for formatting).
* I haven't used fastify or node-json-db before. I was a little torn between using the async functions vs not since the db manipulation would normally be asynchronous, and I'm assuming when implementing the async functions that fastify handles the reply formatting.
* Duplicate orgs are not an issue.