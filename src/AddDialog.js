import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import FilledInput from "@material-ui/core/FilledInput/FilledInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import {AlertDialog} from "./Dialog";
import {Database} from "./Database";

export function AddDialog() {
    const [open, setOpen] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [product, setProduct] = React.useState({});
    const [errorText, setErrorText] = React.useState('');

    const generateBarCode = () => {
        let result = '';
        let characters ='ABCDEF0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < Math.floor(Math.random() * 10); i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const addProduct = ()=>{
        try{
            let data = {...product};
            if(!product.barcode){
                product.barcode = generateBarCode();
            }
            Database.addProduct(product);
            setSuccess(true)
        }catch (e) {
            console.log(e.message);
            setErrorText(e.message)
        }
    };

    return (
        <div>
            <Button style={{margin: 10}} variant="contained" color="primary" onClick={handleClickOpen}>
                Add Product
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{success?'Success':'Add product'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {success?'Barcode: '+product.barcode:'Enter fields'}
                    </DialogContentText>
                    {!success && <form className={'root'} noValidate autoComplete="off">
                        <InputLabel htmlFor="standard-adornment-password">Name</InputLabel>
                        <FilledInput onChange={(event)=> setProduct({...product, name: event.target.value})} id="outlined-basic" label="Find" variant="outlined"/>
                        <InputLabel htmlFor="standard-adornment-password">Price</InputLabel>
                        <FilledInput onChange={(event)=> setProduct({...product, price: event.target.value})} id="outlined-basic" label="Find" variant="outlined"/>
                        <InputLabel htmlFor="standard-adornment-password">Barcode (optional)</InputLabel>
                        <FilledInput error={!!errorText} onChange={(event)=> setProduct({...product, barcode: event.target.value})} id="outlined-basic" label="Find" variant="outlined" endAdornment={
                            <InputAdornment position="end">
                                <AlertDialog />
                            </InputAdornment>
                        } />
                        <p style={{color:'red'}}>{errorText}</p>
                    </form>}
                </DialogContent>
                <DialogActions>
                    {success ? <Button onClick={handleClose} color="primary">
                            Ok
                        </Button>:
                        <Button disabled={!(product.name && product.price)} onClick={addProduct} color="primary">
                        Add
                    </Button>}
                </DialogActions>
            </Dialog>
        </div>
    );
}
