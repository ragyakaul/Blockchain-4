const debug = require('debug')('blockchain-4:api');
const express = require('express');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const anchor = require('../anchoring');

const router = express.Router();

/**
 * Route for getting a list of all previously uploaded and anchored documents
 */
router.get('/list/', async function (req, res) 
{
    res.json(await anchor.getAllDocuments());
});

/**
 * Route for uploading a new document, and anchoring it to the blockchain
 */
router.post('/upload/', upload.any(), async function (req, res) 
{
    //Check for required parameters
    if (!('name' in req.body) || req.body.name.length < 1 || req.files.length < 1) 
    {
        return res.sendStatus(400);
    }
    //Hash the file
    let hash = anchor.hashFile(req.files[0].buffer);

    //Save the document in the datastore and keep track of it's ID
    let id = await anchor.saveDocument(hash, req.body.name);

    //Send a response back to the client
    res.json({id:id, hash:hash});
    
});

/**
 * Route for reuploading a document, and comparing it's fingerprint to the
 * fingerprint of the matching document on the blockchain
 */
router.put('/verify/', upload.any(), async function (req, res) 
{
    //Check for required parameters
    if (!('id' in req.body) || req.body.id.length < 1 || req.files.length < 1) 
    {
        return res.sendStatus(400);
    }
    //Find the document in the datastore
    let storedHash = await anchor.findDocument(req.body.id);
    //Check if we know about the document ID
    if (storedHash === null) 
    {
        return res.sendStatus(404);
    }
    //Hash the file
    let hash = anchor.hashFile(req.files[0].buffer);

    res.json({
        verifySuccess: hash === storedHash, //Check if the hashes differ
        uploadedHash: hash,
        storedHash: storedHash
    });

});

/**
 * Route for deleting an anchored document, and comparing it's fingerprint to the
 * The blockchain will remain unchanged
 */
router.delete('/delete/', async function (req, res) 
{   
    //Check for required parameters
    if (!('id' in req.body) || req.body.id.length < 1) 
    {
        return res.sendStatus(400);
    }

    //Find the document in the datastore
    let count = await anchor.deleteDocument(req.body.id);
    count = count.deletedCount;
    debug('count', count);
    if ( count == 1 )
    {
        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(404);
    }
});

module.exports = router;
