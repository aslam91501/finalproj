/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "kl6wacxaq0qrrkw",
    "created": "2024-03-22 02:44:41.342Z",
    "updated": "2024-03-22 02:44:41.342Z",
    "name": "cases",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "oin9t3k3",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "bkcov2zw",
        "name": "description",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("kl6wacxaq0qrrkw");

  return dao.deleteCollection(collection);
})
