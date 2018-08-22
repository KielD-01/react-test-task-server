const _ = require('lodash');

class PrimaryKeyGenerator {
    _create_key(collection) {
        return collection.push().key;
    }
}

/**
 * To-Do Lists Class
 */
class TodoLists extends PrimaryKeyGenerator {
    constructor(FireBase) {
        super();
        this.db = FireBase.database();
        this.collection_name = 'todo_lists';
        this.collection = this.db.ref(this.collection_name);
    }

    /**
     * Get one or all records
     *
     * @param key
     */
    get(key = false) {
        let data = {};
        let promise = key ?
            this.db.ref(`${this.collection_name}/${key}`) :
            this.db.ref(this.collection_name);

        if (key) {
            promise.once('value').then(snapshot => {
                data = snapshot.val();
            });

            return data;
        }

        promise.once('value').then(snapshot => {
            _.map(snapshot.val(), (item, key) => {
                data[key] = item;
            });
        });

        return data;
    }

    /**
     * Create a record
     *
     * @param todo_list
     * @param title
     */
    create(todo_list, title = 'Untitled List') {
        let item = {};
        const item_key = super._create_key(this.collection);

        item[`/${item_key}`] = {title};

        this.collection
            .update(item)
            .then(() => {
                _.map(todo_list, todo_item => {
                    const itemKey = this.collection.child(item_key)
                        .child('items')
                        .push()
                        .key;

                    this.collection.child(item_key)
                        .child('items')
                        .child(itemKey)
                        .update(todo_item);

                });
            });
    }

    /**
     * Update a record
     *
     * @param key
     * @param data
     * @returns {Promise<void>}
     */
    update(key, data) {
        return this.collection
            .child(key)
            .update(data);
    }

    /**
     * Remove a record
     *
     * @param key
     * @returns {Promise<void>}
     */
    remove(key) {
        return this.collection
            .child(key)
            .remove();
    }
}

class TodoListItems extends PrimaryKeyGenerator {
    constructor(FireBase, TodoLostKey) {
        super();
        this.db = FireBase.database();
        this.collection = this.db.ref('todo_lists')
            .child(TodoLostKey)
            .child('items');
    }

    create(text = 'Lorem Ipsum', completed = false) {
        const todoItemKey = super._create_key(this.collection);

        return this.update(todoItemKey, {text, completed});
    }

    update(key, data) {
        return this.collection
            .child(key)
            .update(data);
    }

    delete(key) {
        return this.collection
            .child(key)
            .remove();
    }
}

module.exports = {
    TodoLists,
    TodoListItems
};