const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../app');
const Customer = require('../models/customer');

describe('CRUD API tests with Sinon, Customer', () => {

  let stubs = [];

  //Actions to be executed during every test

  afterEach(async () => {
    // Restore manually stubs
    stubs.forEach(stub => stub.restore());
    
    // Clear database and restore sample values
    await Customer.deleteAll();
    await Customer.restoreSamples();

    // Clean arrays
    stubs = [];
  });
//Unit tests
  it('Create a new Customer', (done) => {
    const newCustomer = new Customer(null, 'Test Customer Create', 'Lastname', 'email@test');
    const addStub = sinon.stub(newCustomer, 'add').resolves(newCustomer);

    stubs.push(addStub);

    request(app)
      .post('/api/customers')
      .send({ firstName: 'Test Customer Create', lastName: 'Lastname', email: 'email@test' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message', 'Customer created.');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstName', 'Test Customer Create');
        expect(res.body.data).to.have.property('lastName', 'Lastname');
        expect(res.body.data).to.have.property('email', 'email@test');
        done();
      });
  });

  it('Get a Customer by ID', (done) => {
    const customerId = '12345';
    const mockItem = new Customer(customerId, 'Test Customer Create', 'Lastname', 'email@test');
    const getByIdStub = sinon.stub(Customer, 'get').callsFake((id, callback) => {
        callback(null, mockItem);
    });
    stubs.push(getByIdStub);

    request(app)
        .get(`/api/customers/${customerId}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(getByIdStub.calledOnce).to.be.true;
            expect(res.body).to.have.property('id', customerId);
            done();
        });
  });

  it('Update a Customer', (done) => {
    const customerId = '12345'
    const updatedCustomer = new Customer(parseInt(customerId, 10), 'Test Customer Create', 'Lastname', 'email@test');
    const updateStub = sinon.stub(updatedCustomer, 'update').callsFake((id, callback) => {
        callback(null, updatedCustomer);
    });
    stubs.push(updateStub);

    request(app)
      .put('/api/customers/'+customerId)
      .send({ id: customerId, firstName: 'Test Customer Create', lastName: 'Lastname', email: 'email@test' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // expect(updateStub.calledOnce).to.be.true;
        expect(res.body).to.have.property('message', 'Customer updated.');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id', parseInt(customerId, 10));
        done();
      });
  });

  it('Return 404 if Customer not found', (done) => {
    const customerId = '99999';
    const getByIdStub = sinon.stub(Customer, 'get').callsFake((id, callback) => {
        callback(null, null);
    });
    stubs.push(getByIdStub);

    request(app)
        .get(`/api/customers/${customerId}`)
        .expect(404)
        .end((err, res) => {
            if (err) return done(err);
            expect(getByIdStub.calledOnce).to.be.true;
            done();
        });
  });

  it('Delete a Customer', (done) => {
    const customerId = '12345';
    const deleteCustomer = new Customer(customerId, 'Test Customer');

    const deleteStub = sinon.stub(deleteCustomer, 'delete').callsFake((id, callback) => {
        callback(null, null);
    });
    stubs.push(deleteStub);

    request(app)
        .delete('/api/customers/' + customerId)
        .end((err) => {
            if (err) return done(err);
            done();
        });
  });
});
