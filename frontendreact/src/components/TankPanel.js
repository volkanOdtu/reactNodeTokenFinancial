import React ,{Component} from 'react';


export default class TankPanel extends Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            QRdata:'' ,
            totalAmount:0 ,
            isQRCodeReceived:false,
            message: ''
        }
    }

    handleChange =(e) =>{
        
        this.setState({ [e.target.name] :e.target.value })
      }
    
    Pay()
    {

        fetch('http://localhost:5000/payment' ,{
                method: 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                body:JSON.stringify({totalReceiptAmount: this.state.totalAmount })
            }) 
            .then(res =>res.json())
            .then(res => {   
                            console.log(res.resultObj);                              
                                
                            if(res.result === 'success')    
                                this.setState( {QRdata :'' ,totalAmount:0 , isQRCodeReceived :false ,message:'Payment is done ,fue oil is loaded .'} );
                             })
            .catch(error => this.setState({ message:'Payment could not be done' + error }));
                               
    }

    GetQRCode()
    {
        console.log('GetQRCOde dayiz');
        fetch('http://localhost:5000/getqrsale',{
            method: 'POST',
            headers:{
                'content-type': 'application/json'
            },
            body:JSON.stringify({totalReceiptAmount: this.state.totalAmount })
        })
        .then(res =>res.json())
        .then(res => {     
                            console.log(res);
                            console.log(res.resultObj.QRdata);
                            if(res.result === 'success')                                                                                    
                                this.setState( {QRdata : res.resultObj.QRdata ,isQRCodeReceived :true ,message:'QR code data is received successfully'} );
                         })
        .catch(error => this.setState({ QRdata :'', isQRCodeReceived: false ,message:'QR code data could not be received' + error }));                    
    }   
    
    

    render()
    {
        let enabled = true;
        //let divStyle = 'disabled';
        if( this.state.isQRCodeReceived ) enabled =false;  // divStyle = '';
        
        return  <div> 
                    <h2> Tank Panel Fuel Oil Loading Screen </h2>
                    To load oil you need to get QRCode first and do payment
                    <div>
                        Total Amount:
                        <input type ="text" name = "totalAmount" id = "totalAmount" 
                                value = {this.state.totalAmount} onChange = {this.handleChange } ></input> 
                    </div>
                    <div> 
                          <input  type ="button"  onClick = {() => this.GetQRCode()} value = "Get QR Code" />                                              
                     
                          <input  type ="button" disabled={enabled}  onClick = {() => this.Pay()} value = "Do Payment" />                                              
                    </div>                    
                    <div>{this.state.message}</div>
                 </div>
    }
}