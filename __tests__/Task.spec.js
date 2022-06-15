const database = require('../model/database')
const Task = require('../model/Task')
const task = require('../model/Task')
const db = new database('task.db')
describe('Task class', () => {
  test('has getTasks method which return promise', () => {
    const task = new Task(db)
    let spy = jest.spyOn(task, 'getTasks').mockImplementation(() => Promise.resolve());
    expect(typeof task.getTasks).toBe('function')
    expect(task.getTasks()).toEqual(Promise.resolve())
  })
  test('has getTasks method which return promise', () => {
    const task = new Task(db)
    let spy = jest.spyOn(task, 'addTasks').mockImplementation(() => Promise.resolve());
    expect(typeof task.addTasks).toBe('function')
    expect(typeof task.addTasks('test')).toBe('object')
    expect(task.getTasks()).toEqual(Promise.resolve())
  })
  test('has getTasks method which return promise', () => {
    const task = new Task(db)
    let spy = jest.spyOn(task, 'deleteTask').mockImplementation(() => Promise.resolve());
    expect(typeof task.deleteTask).toBe('function')
    expect(typeof task.deleteTask('test')).toBe('object')
    expect(task.getTasks()).toEqual(Promise.resolve())
  })
  test('has getTasks method which return promise', () => {
    const task = new Task(db)
    let spy = jest.spyOn(task, 'updateTask').mockImplementation(() => Promise.resolve());
    expect(typeof task.updateTask).toBe('function')
    expect(typeof task.updateTask('test')).toBe('object')
    expect(task.getTasks()).toEqual(Promise.resolve())
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
})