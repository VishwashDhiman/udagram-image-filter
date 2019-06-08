import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  let files: string[] = [];
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  // Sending response to prevent 4xx errors on root URL
  app.get( "/", async ( req, res ) => {
    res.send( "try /filteredimage?image_url={{URL}}" );
  } );
  // Filters and returns the requested image
  app.get( "/filteredimage", async ( req, res ) => {
    let { image_url } = req.query;
    if(!image_url)
      return res.status(400).send({ message: 'Image url is required' }) 
    deleteLocalFiles(files);
    let result = await filterImageFromURL(image_url);
    if(!result)
      return res.status(422).send({ message: 'Unable to process image due to semantic errors.' })
    files.push(result)
    res.status(200).sendFile(result)
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();