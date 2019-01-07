const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'Learn node js completely',
    completed: false
}, {
    _id: new ObjectID(),
    text: 'Practice by building some thing cool',
    completed: true,
    completedAt: 333
}, {
    _id: new ObjectID(),
    text: 'Practice again face challenges, learn the experiences and win',
}, {
    _id: new ObjectID(),
    text: 'Start learning React.js'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {

        let text = 'Testing new todo';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(5);
                expect(todos[todos.length-1].text).toBe(text);
                done();
            }).catch(e => done(e));
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(4);
                done();
            }).catch(e => done(e));
        });
    });
});

describe('GET /todos', () => {

    it('should fetch all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(4);
        }).end(done);
    });

});

describe('GET /todos/:id', () => {

    it('should return a todo matching the id passed', (done) => {
        let id = todos[0]._id.toHexString();

        request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });

    it('should return 404 not found for invalid id passed', (done) => {
        let id = '5ba63d1d45553ab';

        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 not found for todo not found', (done) => {
        let id = '5ba63d1d45553ab';

        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        let id = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end((err, res) => {
            if (err) {
                return res.done(err);
            }

            Todo.findById(id).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 for todo not found ', (done) => {
        let id = new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object id\'s ', (done) => {
        let id = '123456';

        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        let id = todos[0]._id.toHexString();

        request(app)
        .patch(`/todos/${id}`)
        .send({
            text: 'Learn node.js completely - updated',
            completed: true,
            completedAt:333
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toNotBe(todos[0].text);
            expect(res.body.todo.completed).toNotBe(todos[0].completed).toBeA('boolean');
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });

    it('should update todo to incomplete and unset completedAt', (done) => {
        let id = todos[1]._id.toHexString();

        request(app)
        .patch(`/todos/${id}`)
        .send({completed: false})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBe(null);
        })
        .end(done);
    });
});
