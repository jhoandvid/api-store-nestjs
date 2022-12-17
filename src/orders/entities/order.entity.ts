import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
@Entity({name:'Orders'})
export class Order {

    @PrimaryGeneratedColumn('uuid')
    costumerId:string;

    @Column('date')
    orderDate:Date;
    
    @Column('date')
    shippedDate:Date;
    @Column('text')
    shipName:string;
    @Column('text')
    shipAddress:string;
    


}
