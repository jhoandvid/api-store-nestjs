import { PrimaryGeneratedColumn, Column, Entity, OneToMany, BeforeInsert, DataSource } from 'typeorm';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';
@Entity({name:'orders'})
export class Order {

    @PrimaryGeneratedColumn('uuid')
    costumerId:string;

    @Column('date', {default:()=>"CURRENT_TIMESTAMP" })
    orderDate:Date;
    
    @Column('date')
    shippedDate:Date;

    
    @Column('text')
    shipName:string;
    @Column('text')
    shipAddress:string;

    @OneToMany(()=>OrderDetail,(orderDetail)=>orderDetail.order, {eager:true})
    orderDetail:OrderDetail[]


}
