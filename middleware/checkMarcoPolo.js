export default (req, res, next) => {
    console.log('PASSING THROUGH checkMarcoPolo');

    // Retrieve the 'x-marco' header
    const marcoHeader = req.header('x-marco');
    console.log(`x-marco header value: ${marcoHeader}`);

    // Check if 'x-marco' header is missing or incorrect
    if (!marcoHeader || marcoHeader.toLowerCase() !== 'polo') {
        return res.status(401).send('Unauthorized'); // Send 401 and stop further processing
    }

    // Allow the request to proceed if the header is correct
    next();
};
