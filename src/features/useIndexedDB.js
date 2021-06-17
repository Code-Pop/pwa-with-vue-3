const DATABASE_NAME = 'todomvcdb'
const DATABASE_VERSION = 1
const TABLE_NAME = 'todos'
let database

const getDatabase = async () => {
  return new Promise((resolve, reject) => {
    if (database) {
      return resolve(database)
    }
    console.log('STATUS: Opening database', database)
    let request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onerror = event => {
      console.error('ERROR: Unable to open database', event)
      reject('Error')
    }

    request.onsuccess = e => {
      database = e.target.result
      resolve(database)
    }

    request.onupgradeneeded = e => {
      console.log('onupgradeneeded')
      let database = e.target.result
      database.createObjectStore(ITEM_NAME, {
        autoIncrement: true,
        keyPath: 'id'
      })
    }
  })
}

const getTodos = async () => {
  const db = await getDatabase()

  return new Promise(resolve => {
    let transaction = db.transaction([TABLE_NAME], 'readonly')
    transaction.oncomplete = () => {
      resolve(todos)
    }

    let store = transaction.objectStore(TABLE_NAME)
    let todos = []

    store.openCursor().onsuccess = e => {
      let cursor = e.target.result
      if (cursor) {
        todos.push(cursor.value)
        cursor.continue()
      }
    }
  })
}

const deleteTodo = async todo => {
  const db = await getDatabase()

  return new Promise(resolve => {
    let transaction = db.transaction([ITEM_NAME], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }

    let store = transaction.objectStore(ITEM_NAME)
    store.delete(todo.id)
  })
}

const saveTodo = async todo => {
  const db = await getDatabase()

  return new Promise(resolve => {
    let transaction = db.transaction([ITEM_NAME], 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }

    let store = transaction.objectStore(ITEM_NAME)
    store.put(todo)
  })
}

export default {
  saveTodo,
  getTodos,
  deleteTodo
}
