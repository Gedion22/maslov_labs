export const Database = {
    data:[
        {
            barcode:'123',
            name:'product1',
            price:10,
        },
        {
            barcode:'ABC',
            name:'product2',
            price:20,
        },
        {
            barcode:'0A1',
            name:'product3',
            price:30,
        },
        {
            barcode:'95D',
            name:'product4',
            price:40,
        },
    ],
    addProduct: function(product) {
        if(this.data.some(item => item.barcode === product.barcode)){
            throw new Error('Barcode already exist');
        }
        const re = /[0-9A-F]*/g;
        if(product.barcode.match(re).length === 2 && product.barcode.match(re)[0]) {
            this.data.push(product);
        } else {
            throw new Error('Barcode not hex');
        }
    },
    findProduct: function(barcode) {
        console.log(this.data, barcode);
        const product = this.data.find(item => item.barcode === barcode);
        console.log(product);
        if(!product){
            throw new Error('Barcode dont exist');
        }
        return product;
    },
    deleteProduct: function (barcode) {
        if(!this.data.some(item => item.barcode === barcode)){
            throw new Error('Barcode dont exist');
        }
        const product = this.data.find(item => item.barcode === barcode);
        const index = this.data.indexOf(product);
        this.data.splice(index, 1);
    },
};
