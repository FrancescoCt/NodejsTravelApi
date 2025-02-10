const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../app');
const Product = require('../models/product');

describe('CRUD API tests with Sinon, Products', () => {

  let stubs = [];

  //Actions to be executed during every test

  afterEach(async () => {
    // Restore manually stubs
    stubs.forEach(stub => stub.restore());
    
    // Clear database and restore sample values
    await Product.deleteAll();
    await Product.restoreSamples();

    // Clean arrays
    stubs = [];
  });
//Unit tests
  it('Create a new Product', (done) => {
    const newProduct = new Product({ name: 'Test Product Create' });
    const addStub = sinon.stub(newProduct, 'add').resolves(newProduct);

    stubs.push(addStub);

    request(app)
      .post('/api/products')
      .send({ name: 'Test Product Create' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message', 'Product created.');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('name', 'Test Product Create');
        done();
      });
  });

  it('Get a Product by ID', (done) => {
    const productId = '12345';
    const mockItem = new Product(productId, 'Test Product Id');
    const getByIdStub = sinon.stub(Product, 'get').callsFake((id, callback) => {
        callback(null, mockItem);
    });
    stubs.push(getByIdStub);

    request(app)
        .get(`/api/products/${productId}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(getByIdStub.calledOnce).to.be.true;
            expect(res.body).to.have.property('id', productId);
            expect(res.body).to.have.property('name', 'Test Product Id');
            done();
        });
  });

  it('Update a Product', (done) => {
    const productId = '12345'
    const updatedProduct = new Product(parseInt(productId, 10), 'Updated Product');
    const updateStub = sinon.stub(updatedProduct, 'update').callsFake((id, callback) => {
        callback(null, updatedProduct);
    });
    stubs.push(updateStub);

    request(app)
      .put('/api/products/'+productId)
      .send({id: productId, name: 'Updated Product'})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // expect(updateStub.calledOnce).to.be.true;
        expect(res.body).to.have.property('message', 'Product updated.');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id', parseInt(productId, 10));
        expect(res.body.data).to.have.property('name', 'Updated Product');
        done();
      });
  });

  it('Return 404 if Product not found', (done) => {
    const productId = '99999';
    const getByIdStub = sinon.stub(Product, 'get').callsFake((id, callback) => {
        callback(null, null);
    });
    stubs.push(getByIdStub);

    request(app)
        .get(`/api/products/${productId}`)
        .expect(404)
        .end((err, res) => {
            if (err) return done(err);
            expect(getByIdStub.calledOnce).to.be.true;
            done();
        });
  });

  it('Delete a Product', (done) => {
    const productId = '12345';
    const deleteProduct = new Product(productId, 'Test Product');

    const deleteStub = sinon.stub(deleteProduct, 'delete').callsFake((id, callback) => {
        callback(null, null);
    });
    stubs.push(deleteStub);

    request(app)
        .delete('/api/products/' + productId)
        .end((err) => {
            if (err) return done(err);
            done();
        });
  });
});
