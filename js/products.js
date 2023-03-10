import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import pagination from './pagination.js';

const apiUrl="https://vue3-course-api.hexschool.io/v2";

const path="silvia-hexschool";


let productModal = '';
let delProductModal='';


const app=createApp({
    data() {
        return {
            tempProduct:{},
            products:[],
            isNew: false,
            page:{}
        }
    },
    methods: {
        getAllProducts(page=1){
            axios.get(`${apiUrl}/api/${path}/admin/products/?page=${page}`)
            .then((res)=>{
                this.page=res.data.pagination;
                this.products=res.data.products;
                
            })
            .catch(error=>{
            
                console.log(error);
            })

        }, 
        deleteProduct(){
                axios.delete(`${apiUrl}/api/${path}/admin/product/${this.tempProduct.id}`)
                .then((res)=>{
                    delProductModal.hide();
                    this.getAllProducts();
                    
                })
                .catch(error=>{              
                    console.log(error);
                })
           
        },
        saveProduct(){
            if(this.isNew)
            {
                axios.post(`${apiUrl}/api/${path}/admin/product`,{data :this.tempProduct })
                .then((res)=>{
                    productModal.hide();
                    this.getAllProducts();
                    
                })
                .catch(error=>{
                
                    console.log(error);
                })
            }
            else{
             axios.put(`${apiUrl}/api/${path}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct })
            .then((res)=>{
                productModal.hide();
                this.getAllProducts();
                
            })
            .catch(error=>{
            
                console.log(error);
            })
            }
           
        },
        checkAdmin(){
          axios.post(`${apiUrl}/api/user/check`)
          .then(res=>{            
                this.getAllProducts();                         
          })
          .catch(error=>{
            window.location ="login.html";
          })
        },
        openModal(type,item){ 
            this.isNew=type==='create' ? true : false;
            if (type==='edit'){
                this.tempProduct={...item};

            }
            else
            {
               
                this.tempProduct={ imagesUrl: []};
                // console.log(this.tempProduct)
            }
            productModal.show();
            
        },
        openDeleteModal(item){
            this.tempProduct={...item};
            delProductModal.show();
        }
       
    },
    components:{
        pagination,
    },
    mounted() {
      const token= document.cookie.replace(/(?:(?:^|.*;\s*)hexschoolToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

      axios.defaults.headers.common.Authorization = token;

     const config = {
           headers: { Authorization: token },
           };

      this.checkAdmin();
      productModal=new bootstrap.Modal(document.querySelector("#productModal"));
      delProductModal=new bootstrap.Modal(document.querySelector("#delProductModal"));
    //   this.createProduct();
    },
})


app.component("product-modal", {
    props: ["tempProduct","saveProduct","isNew"],
    template: "#product-modal-template",
  });

  
app.component("del-product-modal",{ 
    template: "#delProduct-modal-template",
    props:["tempProduct","deleteProduct"],

});
app.mount("#app");


