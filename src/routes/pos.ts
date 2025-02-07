import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { PosModel } from '../models/pos';

const posModel = new PosModel();

const router: Router = Router();

router.get('/types', async (req: Request, res: Response) => {
  try {
    const code = req.query.code;
    const rs = await posModel.getType(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  }
});
router.post('/add-product', async (req: Request, res: Response) => {
  try {
    const barcode = req.body.barcode;
    const name = req.body.name;
    const typeCode = req.body.typeCode;
    const price = req.body.price;
    const userCode = req.body.userCode;
    await posModel.addProductManual(req.db, barcode, name, typeCode, price, userCode);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  }
});
router.get('/users', async (req: Request, res: Response) => {
  try {
    const code = req.query.code;
    const rs = await posModel.getUser(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  }
});
router.get('/scan', async (req: Request, res: Response) => {
  try {
    const code:any = req.query.code;
    const rs: any = await posModel.getProductCode(req.db, code.substring(0, 12))
    if (rs.length) {
      res.send({ ok: true, rows: rs[0] });
    } else {
      res.send({ ok: false, error: 'ไม่พบสินค้า' });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  }
});
router.post('/add', async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    const userCode = code.substring(0, 2);
    const typeCode = code.substring(2, 4);
    const price = code.substring(4, 12);
    console.log(code);

    const rs: any = await posModel.getProductCode(req.db, code.substring(0, 12))
    if (rs.length) {
      res.send({ ok: true, rows: rs[0] });
    } else {
      await posModel.addProduct(req.db, code, typeCode, +price, userCode);
      res.send({
        ok: true, rows: {
          barcode: code,
          name: 'เพิ่มหน้าร้าน',
          price: +price
        }
      });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  }
});

router.post('/order', async (req: Request, res: Response) => {
  try {
    const products = req.body.products;
    const type = req.body.type;
    const price = req.body.price;
    const net = req.body.net;
    const obj = {
      price: price,
      net: net,
      type
    }
    const order = await posModel.saveOrder(req.db, obj)
    console.log(order);

    if (order.length) {
      let data = [];
      for (const p of products) {
        data.push({
          order_id: order[0],
          barcode: p.code,
          price: p.price,
          net: p.net
        })
      }
      await posModel.saveOrderDetail(req.db, data);
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'สร้าง Order ไม่ได้' })
    }
  } catch (error) {
    console.log(error);

    res.send({ ok: false, error: error.message });
  }
});

export default router;