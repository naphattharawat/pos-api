import { Knex } from 'knex'
export class PosModel {
  getProduct(db: Knex.QueryInterface, code) {
    return db.table('products')
      .where('barcode', code)
      .where('is_actived', 'Y')
      .limit(1);
  }
  getProductCode(db: Knex.QueryInterface, code) {
    return db.table('products')
      .whereRaw('left(barcode,12)=?', code)
      .where('is_actived', 'Y')
      .limit(1);
  }
  getType(db: Knex.QueryInterface) {
    return db.table('types')
  }
  getUser(db: Knex.QueryInterface) {
    return db.table('users')
  }

  addProduct(db: Knex.QueryInterface, code, typeCode, price, userCode) {
    return db.table('products')
      .insert({
        barcode: code,
        name: 'เพิ่มหน้าร้าน',
        type_code: typeCode,
        price: price,
        user_code: userCode
      });
  }

  saveOrder(db: Knex.QueryInterface, data: any) {
    return db.table('orders')
      .insert(data).returning('id');
  }
  saveOrderDetail(db: Knex.QueryInterface, data: any) {
    return db.table('order_details')
      .insert(data)
  }

  addProductManual(db: Knex.QueryInterface, barcode, name, typeCode, price, userCode) {
    return db.table('products')
      .insert({
        barcode: barcode,
        name: name,
        type_code: typeCode,
        price: price,
        user_code: userCode
      });
  }
}