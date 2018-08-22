const _ = require('lodash');

/**
 * To-Do Lists Class
 */
class TodoLists {
    constructor(FireBase) {
        this.db = FireBase.database();
        this.collection_name = 'todo_lists';
        this.collection = this.db.ref(this.collection_name);
    }

    /**
     * Creating Primary Key
     *
     * @returns {string}
     * @private
     */
    _create_key() {
        return this.collection.push().key;
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
            promise.on('value', snapshot => {
                data = snapshot.val();
            });

            return data;
        }

        promise
            .on('value', snapshot => {
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
        const item_key = this._create_key();

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
     * @returns {Promise<any>}
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
     * @returns {Promise<any>}
     */
    remove(key) {
        return this.collection
            .child(key)
            .remove();
    }
}

module.exports = {
    TodoLists
};