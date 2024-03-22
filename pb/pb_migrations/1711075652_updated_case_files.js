/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("loson61x5m9srwv")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qimxhxyz",
    "name": "case",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "kl6wacxaq0qrrkw",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("loson61x5m9srwv")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qimxhxyz",
    "name": "case",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "kl6wacxaq0qrrkw",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
