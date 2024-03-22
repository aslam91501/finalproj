/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kl6wacxaq0qrrkw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kf6wyceo",
    "name": "laywer",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kl6wacxaq0qrrkw")

  // remove
  collection.schema.removeField("kf6wyceo")

  return dao.saveCollection(collection)
})
