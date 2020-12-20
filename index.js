// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;


let db = new JsonDB(new Config("./data/orgs", true, false, '/'));
let orgs = db.getData("/organizations");

fastify.get('/organizations/:orgcode', async ( req, res) => {
    //filter the orgs array for the item with the orgcode
    let orgCode = req.params.orgcode;
    let resOrg = orgs.filter(org => {
        return org.orgCode == orgCode
    });
    console.log(resOrg);
    if (resOrg == []){
        res
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ success: 'true', org: []})
    }
    else{
        res
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ success: 'true', org: resOrg})
    }
    
})

//curl -d '{"name":"test123","orgId":"testId123"}' -H "Content-Type: application/json" -X POST http://localhost:3000/organizations/testCode123
//fails: curl -d '{"orgId":"testId123"}' -H "Content-Type: application/json" -X POST http://localhost:3000/organizations/testCode123
fastify.post('/organizations/:orgcode', async ( req, res) => {
    if (!req.body.name || !req.body.orgId){
        res
            .code(400)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ success: 'false', message: 'name and ordId are required' })
    }

    let { name, orgId } = req.body;
    let orgCode = req.params.orgcode;

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let creationDate = mm + '/' + dd + '/' + yyyy;
    db.push("/organizations", [{name, orgCode, orgId, creationDate}], false);
    res
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ success: 'true', message: 'Organization successfully created.'})
})

//curl -d '{"name":"test123","orgId":"testId123"}' -H "Content-Type: application/json" -X PUT http://localhost:3000/organizations/U23V
//fails: curl -d '{"name":"test123"}' -H "Content-Type: application/json" -X PUT http://localhost:3000/organizations/U23V 
fastify.put('/organizations/:orgcode', async ( req, res) => {
    if (!req.body.name || !req.body.orgId){
        res
            .code(400)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ success: 'false', message: 'name and ordId are required' })
    }
    
    let { name, orgId } = req.body;
    let orgCode = req.params.orgcode;

    let newOrgs = orgs.map(org => {
        if (org.orgCode == orgCode){
            return {...org, name, orgId};
        }
        else{
            return org;
        }
    });

    db.push("/organizations", newOrgs, true);
    res
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ success: 'true', message: 'Organization successfully updated.'})
})

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()