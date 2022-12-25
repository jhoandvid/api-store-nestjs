import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate } from 'typeorm';


@Entity({name:'order_details'})
export class OrderDetail {

    @PrimaryGeneratedColumn('uuid')
    orderId:string;

    @Column('decimal', {precision: 10, scale: 2})
    unitPrice:number;

    @Column('int')
    quantity:number;

    @Column('decimal', {precision: 10, scale: 2, default: 0})
    discount:number;

    @Column('date', {default:()=>"CURRENT_TIMESTAMP" })
    dateOrder:Date

    

    @Column('decimal', {precision: 10, scale: 2, default: 0})
    total:number;


    @ManyToOne(()=>Product, (product=>product.orderDetail))
    product:Product;

    @ManyToOne(()=>Order,(order)=>order.orderDetail)
    order:Order;



    @BeforeInsert()
    @BeforeUpdate()
    calculatePorcentaje(){

        console.log("descuento"+this.discount);

        if(this.discount>=1){
            this.discount=(this.discount/100);
        }
        
      
           
    }

    @BeforeInsert()
    @BeforeUpdate()
    calculateTotal(){
        let subtotal=this.quantity*this.unitPrice;
        if(this.discount){
            this.total=subtotal-(subtotal*this.discount);
        }else{
            this.total=subtotal;
        }
        
    }



}
