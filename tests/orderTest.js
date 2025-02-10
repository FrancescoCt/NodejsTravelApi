const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../app');
const Order = require('../models/order');

describe('CRUD API tests with Sinon, Order', () => {

  let stubs = [];

  //Actions to be executed during every test

  afterEach(async () => {
    // Restore manually stubs
    stubs.forEach(stub => stub.restore());
    
    // Clear database and restore sample values
    await Order.deleteAll();
    await Order.restoreSamples();

    // Clean arrays
    stubs = [];
  });
//Unit tests
  it('Create a new Order', (done) => {
    const newOrder = new Order(null, '2025/01/24');
    const addStub = sinon.stub(newOrder, 'add').resolves(newOrder);

    stubs.push(addStub);

    request(app)
      .post('/api/orders')
      .send({ orderDate: '2025/01/24' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message', 'Order created.');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('orderDate', '2025/01/24');
        done();
      });
  });

  it('Get a Order by ID', (done) => {
    const orderId = '12345';
    const mockItem = new Order(orderId, '2025/01/24');
    const getByIdStub = sinon.stub(Order, 'get').callsFake((id, callback) => {
        callback(null, mockItem);
    });
    stubs.push(getByIdStub);

    request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(getByIdStub.calledOnce).to.be.true;
            expect(res.body).to.have.property('id', orderId);
            done();
        });
  });

  it('Update a Order', (done) => {
    const orderId = '12345'
    const updatedOrder = new Order(parseInt(orderId, 10), '2025/01/24');
    const updateStub = sinon.stub(updatedOrder, 'update').callsFake((id, callback) => {
        callback(null, updatedOrder);
    });
    stubs.push(updateStub);

    request(app)
      .put('/api/orders/'+orderId)
      .send({ id: orderId, orderDate: '2025/01/24' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // expect(updateStub.calledOnce).to.be.true;
        expect(res.body).to.have.property('message', 'Order updated.');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id', parseInt(orderId, 10));
        done();
      });
  });

  it('Return 404 if Order not found', (done) => {
    const orderId = '99999';
    const getByIdStub = sinon.stub(Order, 'get').callsFake((id, callback) => {
        callback(null, null);
    });
    stubs.push(getByIdStub);

    request(app)
        .get(`/api/orders/${orderId}`)
        .expect(404)
        .end((err, res) => {
            if (err) return done(err);
            expect(getByIdStub.calledOnce).to.be.true;
            done();
        });
  });

  it('Delete a Order', (done) => {
    const orderId = '12345';
    const deleteOrder = new Order(orderId, 'Test Order');

    const deleteStub = sinon.stub(deleteOrder, 'delete').callsFake((id, callback) => {
        callback(null, null);
    });
    stubs.push(deleteStub);

    request(app)
        .delete('/api/orders/' + orderId)
        .end((err) => {
            if (err) return done(err);
            done();
        });
  });
});
