import { db } from "./Database"

export const crud = {
    getSetting: async key => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'SELECT * FROM settings WHERE key=?',
                    [key],
                    (tx, res) => {
                        const setting = res.rows.item(0)
                        if(!setting) resolve(null)
                        resolve(setting.value_text ? setting.value_text : setting.value_int)
                    }, err => console.log(err)
                )
            })
        })
    },
    setSetting: async (key, value) => {
        return new Promise(async (resolve, reject) => {
            const existingSetting = await crud.getSetting(key)
            db.transaction(txn => {
                txn.executeSql(
                    existingSetting !== null ? 'UPDATE settings SET value_int=?, value_text=? WHERE key=?' : 
                        'INSERT INTO settings (value_int, value_text, key) VALUES (?,?,?)',
                    Number.isInteger(value) ? [value, null, key] : [null, value, key],
                    (tx, res) => resolve(), err => console.log(err)
                )
            })
        })
    },

    createRoad: async (nr, name) => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'INSERT OR IGNORE INTO roads (nr,name) VALUES (?,?)',
                    [nr, name], (tx, res) => {
                        resolve(res.insertId)
                    }, err => console.log(err)
                )
            })
        })
    },
    getRoadId: async (nr, name) => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'SELECT id FROM roads WHERE nr=? AND name=?',
                    [nr, name], (tx, res) => {
                        if(res.rows.length < 1) resolve(null)
                        resolve(res.rows.item(0).id)
                    }, err => console.log(err)
                )
            })
        })
    },
    getRoads: async () => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'SELECT r.*, COUNT(i.id) AS number_incidents FROM incidents i INNER JOIN roads r ON i.road_id=r.id WHERE i.delay >= 3 GROUP BY r.id ORDER BY substr(r.nr,1,1), CAST(substr(r.nr,2,8000) AS INTEGER)',
                    [],
                    (tx, res) => {
                        let roads = []
                        for(let i = 0; i < res.rows.length; i++)
                            roads.push(res.rows.item(i))
                        resolve(roads)
                    }, err => console.log(err)
                )
            })
        })
    },

    createDescription: async (incidentId, description) => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'INSERT OR IGNORE INTO descriptions (incident_id, description) VALUES (?,?)',
                    [incidentId, description], (tx, res) => resolve(), err => console.log(err)
                )
            })
        })
    },
    getDescriptions: async (incidentId) => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'SELECT description FROM descriptions WHERE incident_id=? ORDER BY description DESC',
                    [incidentId], 
                    (tx, res) => {
                        let descriptions = []
                        for(let i = 0; i < res.rows.length; i++)
                            descriptions.push(res.rows.item(i).description)
                        resolve(descriptions)
                    }, err => console.log(err)
                )
            })
        })
    },

    createIncident: async (id, type, road, from, to, length, delay_min, descriptions) => {
        return new Promise(async (resolve, reject) => {
            let roadId = await crud.getRoadId(road.nr, road.name)
            roadId = roadId ? roadId : await crud.createRoad(road.nr, road.name)
            db.transaction(txn => {
                txn.executeSql(
                    'INSERT OR IGNORE INTO incidents (id, type, road_id, from_dest, to_dest, length, delay) VALUES (?,?,?,?,?,?,?)',
                    [id, type, roadId, from, to, length, delay_min],
                    async (tx, res) => {
                        for(const description of descriptions)
                            await crud.createDescription(id, description)
                        resolve()
                    }, err => console.log(err)
                )
            })
        })
    },
    getIncidentsByRoad: async (roadId) => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'SELECT * FROM incidents WHERE road_id=? AND delay >= 3',
                    [roadId],
                    async (tx, res) => {
                        let incidents = []
                        for(let i = 0; i < res.rows.length; i++) {
                            incidents[i] = res.rows.item(i)
                            incidents[i].descriptions = await crud.getDescriptions(incidents[i].id)
                        }
                        resolve(incidents)
                    }, err => console.log(err)
                )
            })
        })
    },
    clearIncidents: async () => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'DELETE FROM incidents',
                    [], (tx, res) => resolve(), err => console.log(err)
                )
            })
        })
    },

    getBboxes: async onlyEnabled => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    onlyEnabled ? 'SELECT * FROM bboxes WHERE enabled=1' : 'SELECT * FROM bboxes',
                    [],
                     (tx, res) => {
                        let bboxes = []
                        for(let i = 0; i < res.rows.length; i++)
                            bboxes.push(res.rows.item(i))
                        resolve(bboxes)
                     }, 
                     err => console.log(err)
                )
            })
        })
    },
    updateBbox: async (id, enabled, description, bbox) => {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'UPDATE bboxes SET enabled=?, description=?, bbox=? WHERE id=?',
                    [enabled, description, bbox, id],
                    (tx, res) => resolve(), err => console.log(err)
                )
            })
        })
    }
}