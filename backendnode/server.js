const express = require("express");
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 5000;
const request = require("request");

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) =>{
    res.json( {port} + '5000 deyiz')
});

//Satis icin QR kodu olusturuluyor ,tutar gonderiliyor
app.post('/getqrsale', (req, res) => {
    
    var options = { method: 'POST',
    url: 'https://sandbox-api.payosy.com/api/get_qr_sale',
    headers: 
     { 'accept': 'application/json',
       'content-type': 'application/json',
       'x-ibm-client-secret': 'bF1rB2nC1jY2tM4dL2bU1yO8sB1kX7cP3nK3pU0bV3gH1cN3uT',
       'x-ibm-client-id': 'd56a0277-2ee3-4ae5-97c8-467abeda984d' },
    body: { totalReceiptAmount: parseInt(req.body.totalReceiptAmount) },
    json: true };
  
  request(options, function (error, response, body) {
    if (error) 
    {
         console.error('Failed: %s', error.message);
         return res.json( {result :'error' ,errormessage : error.message} ); 
    }
        

    console.log('Success: ', body);
    return res.json( {result :'success' ,resultObj :body} );
  });
  
  
});


app.post('/payment', (req, res) => {
    console.log('odeme deyiz');
    
    var options = { method: 'POST',
                    url: 'https://sandbox-api.payosy.com/api/payment',
                    headers: 
                    { accept: 'application/json',
                        'content-type': 'application/json',
                        'x-ibm-client-secret': 'bF1rB2nC1jY2tM4dL2bU1yO8sB1kX7cP3nK3pU0bV3gH1cN3uT',
                        'x-ibm-client-id': 'd56a0277-2ee3-4ae5-97c8-467abeda984d' },
                    body: 
                    { returnCode: 1000,
                        returnDesc: 'success',
                        receiptMsgCustomer: 'beko Campaign',
                        receiptMsgMerchant: 'beko Campaign Merchant',
                        paymentInfoList: 
                        [ { paymentProcessorID: 67,
                            paymentActionList: [ { paymentType: 3, amount: req.body.totalReceiptAmount, currencyID: 949, vatRate: 800 } ] } ],
                        QRdata: req.body.QRdata 
                        },
                    json: true };

    request(options, function (error, response, body) 
    {
        if (error) 
        {
            return res.json( {result :'error' ,errormessage : error.message} );
        }
            
        return res.json( {result :'success' ,resultObj :body} );
    });

});



app.listen(port ,function(){
    console.log('Server started on port 5000...');
  });
  