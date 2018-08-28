const fs = require('fs')
const process = require('process')
const OpenCC = require('opencc')
const Realm = require('realm')

//const openccs2t = new OpenCC('s2t.json')
const opencct2s = new OpenCC('t2s.json')

let filesAuthor = {tang: [], song: []}
let filesPoet = {tang: [], song: [], shijing: []}

process.argv.forEach((path, index) => {
    if(index <= 1) return
    console.log(`start process path=${path}`)
    if(!path.endsWith('/')) {
        path = path + '/'
    }

    let files = fs.readdirSync(path)
    files = files.map(file => path + file)
    files = files.filter(file => file.endsWith('.json'))
    

    files.forEach(file => {
        let fileName = file.substr(file.lastIndexOf('/') + 1)
        if(fileName.includes('author')) {
            if(fileName.includes('tang')) {
                filesAuthor.tang.push(file)
                return
            }
            if(fileName.includes('song')) {
                filesAuthor.song.push(file)
            }
            return
        }
        if(fileName.includes('poet')) {
            if(file.includes('tang')) {
                filesPoet.tang.push(file)
                return
            }
            if(file.includes('song')) {
                filesPoet.song.push(file)
                return
            }
            return
        }
        if(fileName.includes('ci')) {
            if(file.includes('song')) {
                filesPoet.song.push(file)
                return
            }
            return
        }
        if(fileName.includes('shijing')) {
            filesPoet.shijing.push(file)
        }
    })
})

const AuthorTangSchema = {
    name: 'AuthorTang',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        desc: 'string',
    }
}
const AuthorSongSchema = {
    name: 'AuthorSong',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        desc: 'string',
    }
}

const PoetTangSchema = {
    name: 'PoetTang',
    primaryKey: 'id',
    properties: {
        id: 'int',
        title: 'string',
        content: 'string',
        author: 'string'
    }
}

const PoetSongSchema = {
    name: 'PoetSong',
    primaryKey: 'id',
    properties: {
        id: 'int',
        title: 'string',
        content: 'string',
        author: 'string'
    }
}

const ShijingSchema = {
    name: 'Shijing',
    primaryKey: 'id',
    properties: {
        id: 'int',
        title: 'string',
        content: 'string'
    }
}

let realm = new Realm({
        schema: [AuthorTangSchema, AuthorSongSchema, PoetTangSchema, PoetSongSchema, ShijingSchema], 
        path: './poet-data/poet.realm',
        schemaVersion: 1,
        migration: (oldRealm,newRealm)=>{}
    })

let id = 0
const getNextId = () => {
    id += 1
    return id
}

Object.entries(filesAuthor).forEach(([dynasty, authors]) => {
    authors.forEach(file => {
        console.log(`process author file ${file}`)
        const content = fs.readFileSync(file)
        const contentJS = JSON.parse(content)

        contentJS.forEach(author => {
            author.id = getNextId()
            author.name = opencct2s.convertSync(author.name)
            author.desc = typeof(author.desc) === 'string' ? author.desc : author.description
            author.desc = opencct2s.convertSync(author.desc)
            try {
                let schema = dynasty === 'tang' ? 'AuthorTang' : 'AuthorSong'
                let dbAuthor = realm.objects(schema).filtered('name = $0', author.name)
                if (!dbAuthor || dbAuthor.length <= 0) {
                    realm.write(() => {
                        realm.create(schema, author)
                    })
                }
            } catch (error) {
                console.log('write author error: ' + error)
            }
        
        })
    })
})
console.log('author done')
Object.entries(filesPoet).forEach(([type, poets]) => {
    if(type === 'tang' || type === 'song' || type == 'shijing') {
        poets.forEach(file => {
            console.log(`process poet file ${file}`)
            const content = fs.readFileSync(file)
            const contentJS = JSON.parse(content)

            contentJS.forEach(poetJS => {
                let schema = 'Shijing'
                let poet = {}
                poet.id = getNextId()
                poet.title = typeof(poetJS.title) === 'string' ? poetJS.title : poetJS.rhythmic
                poet.title = opencct2s.convertSync(poet.title)
                if (type === 'tang' || type === 'song') {
                    poet.author = opencct2s.convertSync(poetJS.author)
                    poet.content = poetJS.paragraphs.join('')
                    poet.content = opencct2s.convertSync(poet.content)
                    schema = type === 'tang' ? 'PoetTang' : 'PoetSong'

                } else {
                    let chapter = opencct2s.convertSync(poetJS.chapter)
                    let section = opencct2s.convertSync(poetJS.section)
                    poet.title = chapter + '/' + section + '/' + poet.title
                    poet.content = poetJS.content.join('')
                    poet.content = opencct2s.convertSync(poet.content)
                }
                try {
                    realm.write(() => {
                        realm.create(schema, poet)
                    })
                } catch (error) {
                    console.log('write poet file error: ' + error)
                }
            })
        })
    }
})
console.log('poet done')
realm.close()
