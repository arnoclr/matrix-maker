import $ from 'jquery'

var changelog = {}
const regex = {
    releaseNumber: /\[([0-9]+.[0-9]+.[0-9]+(-beta|-alpha)?)\]/g,
    releaseDate: /- ([0-9]{4}-[0-9]{2}-[0-9]{2})/g
}

async function changelogParse(file) {
    const text = await $.get(file)

    const releases = text.split('\n## ')
    releases.shift()
    releases.forEach(r => {
        let version = [...r.matchAll(regex.releaseNumber)]
        let date = [...r.matchAll(regex.releaseDate)]
        version = version[0] != null ? version[0][1] : '_exclude'
        date = date[0] != null ? date[0][1] : null
        if(changelog.latest == undefined) {
            changelog.latest = version
        }
        if(changelog.date == undefined) {
            changelog.date = date
        }
        let categories = r.split('\n### ')
        categories.shift()
        changelog[version] = {}
        categories.forEach(c => {
            let lines = c.split('\n')
            let categorieName = lines.shift()
            lines.pop()
            lines.forEach((l, i) => {
                lines[i] = l.substring(2)
            })
            changelog[version][categorieName] = lines
        })
    });

    return changelog
}

export {changelogParse}