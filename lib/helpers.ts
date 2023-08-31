import moment from 'moment';

const platformImageMapping = {
    'nature': '/platform-images/nature.png',
    'science': '/platform-images/science.png',
    'cell': '/platform-images/cell.png',
    'arxiv': '/platform-images/arxiv.png',
    'plos': '/platform-images/plos.png',
    'springer': '/platform-images/springer.png',
    'spotify': '/platform-images/spotify.png',
    'youtube': '/platform-images/youtube.png',
    'paper': '/platform-images/paper.png',
    'semantic scholar': '/platform-images/semantic-scholar.png',
    'cells': '/platform-images/cells.png',
    'elsevier': '/platform-images/elsevier.png',
    'frontiers': '/platform-images/frontiers.png',
    'mdpi': '/platform-images/mdpi.png',
    'biomedicines': '/platform-images/mdpi.png',
    'febs': '/platform-images/febs.png',
    'advanced-science': '/platform-images/advanced-science.png',
    'faseb': '/platform-images/faseb.png',
    'mbc': '/platform-images/mbc.png',
    'company-of-biologists': '/platform-images/company-of-biologists.png',
    'annual-reviews': '/platform-images/annual-reviews.png',
    'royal-society': '/platform-images/royal-society.png',
    'findings': '/platform-images/findings.png',
    'acm': '/platform-images/acm.png',
    'sigmod conference': '/platform-images/acm.png',
    'acm transactions on intelligent systems and technology': '/platform-images/acm.png',
    'apr': '/platform-images/acm.png',
    'flairs': '/platform-images/flairs.png',
    'ieee': '/platform-images/ieee.png',
    'algorithms': '/platform-images/algorithms.png',
    'enns': '/platform-images/enns.png',
    'acl': '/platform-images/acl.png',
    'acs': '/platform-images/acs.png',
    'naacl-hlt': '/platform-images/acl.png',
    'annual meeting of the association for computational linguistics': '/platform-images/acl.png',
    'interspeech': '/platform-images/interspeech.png',
    'coling': '/platform-images/coling.png',
    'inf.': '/platform-images/inf..png',
    'ijcnn': '/platform-images/ijcnn.png',
    'icml': '/platform-images/icml.png',
    'computational and mathematical methods in medicine': '/platform-images/hindawi.png',
    'computational intelligence and neuroscience': '/platform-images/hindawi.png',
    'oxidative medicine and cellular longevity': '/platform-images/hindawi.png',
    'gigascience': '/platform-images/oxford.png',
    'acs omega': '/platform-images/acs.png',
    'biorxiv': '/platform-images/biorxiv.png',
    'medrxiv': '/platform-images/medrxiv.png',
    'scientific reports': '/platform-images/nature.png',
    'cvpr': '/platform-images/cvpr.png',
    'bmc': '/platform-images/bmc.png',
    'international conference on learning representations': '/platform-images/iclr.png',
    'neural processing letters': '/platform-images/springer.png',
    'open comput. sci.': '/platform-images/de-gruyter.png',
    'journal of chemical physics': '/platform-images/aip.png',
    'developmental biology': '/platform-images/elsevier.png',
    'development': '/platform-images/company-of-biologists.png',
    'entropy': '/platform-images/mdpi.png',
    'genes': '/platform-images/mdpi.png',
    'current biology': '/platform-images/cell.png',
    'journal of tissue engineering': '/platform-images/sage.png',
    'developmental cell': '/platform-images/cell.png',
    'kidney international': '/platform-images/kidney-international.png',
    'seminars in cell and developmental biology': '/platform-images/elsevier.png',
    'british journal of cancer': '/platform-images/nature.png',
    'journal of cell science': '/platform-images/company-of-biologists.png',
    'cell death and differentiation': '/platform-images/nature.png',
    'european respiratory journal': '/platform-images/ers.png',
    'european respiratory review': '/platform-images/ers.png',
    'erj open research': '/platform-images/ers.png',
    'breathe': '/platform-images/ers.png',
    'the ers monograph and ers handbooks': '/platform-images/ers.png',
    'european lung white book': '/platform-images/ers.png',
    'neuron': '/platform-images/cell.png',
    'international journal of biological macromolecules': '/platform-images/elsevier.png',
    'lab on a chip': '/platform-images/rsc.png',
    'cell reports': '/platform-images/cell.png',
    'chemical reviews': '/platform-images/acs.png',
    'biological psychiatry': '/platform-images/elsevier.png',
    'eneuro': '/platform-images/sfn.png',
    'jneurosci': '/platform-images/sfn.png',
    'neuroscience quarterly': '/platform-images/sfn.png',
    "elife": "/platform-images/elife.png",
    'communications biology': '/platform-images/nature.png',
    'proceedings of the national academy of sciences': '/platform-images/pnas.png',
    'royal society open science': '/platform-images/royal-society.png',
    'applied soft computing': '/platform-images/elsevier.png',
    'computers in biology and medicine': '/platform-images/elsevier.png',
    'computers & industrial engineering': '/platform-images/elsevier.png',
    'conference on fairness, accountability and transparency': '/platform-images/acm.png',
    'sdm': '/platform-images/siam.png',
    'miccai': '/platform-images/miccai.png',
    'briefings bioinform.': '/platform-images/oxford.png',
    'data mining and knowledge discovery': '/platform-images/springer.png',
    'knowledge discovery and data mining': '/platform-images/springer.png',
    'international journal of environmental research and public health': '/platform-images/mdpi.png',
    'conference on uncertainty in artificial intelligence': '/platform-images/auai.png',
    'cancer cell': '/platform-images/cell.png',
    'the web conference': '/platform-images/the-web-conference.png',
    'applied sciences': '/platform-images/mdpi.png',
    'vaccines': '/platform-images/mdpi.png',
    'contrast media & molecular imaging': '/platform-images/hindawi.png',
    'medical image analysis': '/platform-images/elsevier.png',
    'trends in molecular medicine': '/platform-images/cell.png',
    'trends in biotechnology': '/platform-images/cell.png',
    'biotechnology advances': '/platform-images/elsevier.png',
    "advanced drug delivery reviews": "/platform-images/elsevier.png",
    "science advances": "/platform-images/science.png",
    "advances in materials": "/platform-images/science_publishing_group.png",
    "research": "/platform-images/science.png",
    "npr": "/platform-images/npr.png",
    "biochemical engineering journal": "/platform-images/elsevier.png",
    "carbohydrate polymers": "/platform-images/elsevier.png",
    "nano today": "/platform-images/elsevier.png",
    "foods": "/platform-images/mdpi.png",
    "processes": "/platform-images/mdpi.png",
    "pharmaceutics": "/platform-images/mdpi.png",
    "tips - trends in pharmacological sciences": "/platform-images/cell.png",
    "substack": "/platform-images/substack.png",
    "matrix editions": "/platform-images/matrix-editions.png",
    "github": "/platform-images/github.png",
    "book": "/platform-images/book.png",
    "anchor books": "/platform-images/anchor-books.png",
    "pegasus books": "/platform-images/pegasus-books.png",
    "mit press": "/platform-images/mit-press.png",
    "penguin random house": "/platform-images/penguin-random-house.png",
    "harvard business press": "/platform-images/harvard.png"
}

const parseContentForTable = (content: any[]) => {
    content.map((item) => {
        // if (platformImageMapping[item.venue.toLowerCase() as keyof typeof platformImageMapping]) {
        //     item.platformImage = platformImageMapping[item.venue.toLowerCase()];
        // }

        if (item.authors && item.authors.length > 0) {
            item.authorsDisplayed = item.authors
        }

        if (!item.venue) item.venue = ""
        if (item.venue == "YouTube") {
            item.platformImage = platformImageMapping["youtube"]
        }

        if (!item.externalIds) {
            item.externalIds = {}
            console.log('item')
        }
        if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("fcell")) {
            item.venue = "Frontiers"
            item.platformImage = platformImageMapping["frontiers"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("cells")) {
            item.venue = "Cells"
            item.platformImage = platformImageMapping["cells"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("j.semcdb")) {
            item.venue = "Seminars in Cell & Developmental Biology"
            item.platformImage = platformImageMapping["elsevier"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("j.ydbio")) {
            item.venue = "Developmental Biology"
            item.platformImage = platformImageMapping["elsevier"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("ijms")) {
            item.venue = "International Journal of Molecular Sciences"
            item.platformImage = platformImageMapping["mdpi"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("mbc.")) {
            item.venue = "Molecular Biology of the Cell"
            item.platformImage = platformImageMapping["mbc"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("fasebj.")) {
            item.venue = "FASEB"
            item.platformImage = platformImageMapping["faseb"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("fnins.")) {
            item.venue = "Frontiers"
            item.platformImage = platformImageMapping["frontiers"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && (item.externalIds["DOI"].includes("fnmol.") || item.externalIds["DOI"].includes("fncel."))) {
            item.venue = "Frontiers"
            item.platformImage = platformImageMapping["frontiers"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("j.tcb.")) {
            item.venue = "Trends in Cell Biology"
            item.platformImage = platformImageMapping["cell reports"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("advs.")) {
            item.venue = "Advanced Science"
            item.platformImage = platformImageMapping["advanced-science"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("jcs.")) {
            item.venue = "Journal of Cell Science"
            item.platformImage = platformImageMapping["company-of-biologists"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("adhm.")) {
            item.venue = "Advanced Healthcare Materials"
            item.platformImage = platformImageMapping["advanced-science"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("j.cub.")) {
            item.venue = "Current Biology"
            item.platformImage = platformImageMapping["cell reports"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("rsos.")) {
            item.venue = "Royal Society Open Science"
            item.platformImage = platformImageMapping["royal-society"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("j.csbj.")) {
            item.venue = "Computational and Structural Biotechnology Journal"
            item.platformImage = platformImageMapping["elsevier"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("annurev-")) {
            item.venue = "Annual Reviews"
            item.platformImage = platformImageMapping["annual-reviews"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("/biology")) {
            item.venue = "Biology"
            item.platformImage = platformImageMapping["mdpi"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["DOI"] && item.externalIds["DOI"].includes("febs")) {
            item.venue = "FEBS"
            item.platformImage = platformImageMapping["febs"]
            item.url = `https://doi.org/${item.externalIds["DOI"]}`
        } else if (item.externalIds["ArXiv"] || item.externalIds["arXiv"]) {
            item.venue = "arXiv"
            item.platformImage = platformImageMapping["arxiv"]
            item.url = `https://arxiv.org/abs/${item.externalIds["ArXiv"]}`
        }

        if (item.openAccessPdf && item.openAccessPdf.url) {
            item.url = item.openAccessPdf.url
        }

        if (item.venue.includes("IEEE")) {
            item.venue = "IEEE"
        } else if (item.venue.includes("Nature")) {
            item.venue = "Nature"
        } else if (item.venue.includes("International Conference on Artificial Neural Networks")) {
            item.venue = "ICANN"
            item.platformImage = platformImageMapping["enns"]
        } else if (item.venue.includes("International Joint Conference on Neural Networks")) {
            item.venue = "IJCNN"
            item.platformImage = platformImageMapping["ijcnn"]
        } else if (item.venue.includes("International Conference on Machine Learning")) {
            item.venue = "ICML"
            item.platformImage = platformImageMapping["icml"]
        } else if (item.venue.includes(" ACM ")) {
            item.platformImage = platformImageMapping["acm"]
        } else if (item.venue.includes("Association for Computational Linguistics")) {
            item.platformImage = platformImageMapping["acl"]
        } else if (item.venue.includes("Workshop on Biomedical Natural Language Processing")) {
            item.platformImage = platformImageMapping["acl"]
        } else if (item.venue.includes("Computer Vision and Pattern Recognition")) {
            item.platformImage = platformImageMapping["cvpr"]
        } else if (item.venue.includes("Reliability Engineering & System Safety")) {
            item.platformImage = platformImageMapping["elsevier"]
        } else if (item.venue.includes("BMC ")) {
            item.platformImage = platformImageMapping["bmc"]
        } else if (item.venue.includes("PLoS")) {
            item.platformImage = platformImageMapping["plos"]
        } else if (item.venue.includes("Annual Review of")) {
            item.platformImage = platformImageMapping["annual-reviews"]
        } else if (item.venue.includes("Current Opinion in")) {
            item.platformImage = platformImageMapping["elsevier"]
        } else if (item.venue.includes("Frontiers in")) {
            item.platformImage = platformImageMapping["frontiers"]
        } else if (item.venue.includes("Acta ")) {
            item.platformImage = platformImageMapping["elsevier"]
        } else if (item.venue.includes("Seminars in ")) {
            item.platformImage = platformImageMapping["elsevier"]
        } else if (item.venue.includes("ACS ")) {
            item.platformImage = platformImageMapping["acs"]
        } else if (item.venue.includes("@MICCAI")) {
            item.platformImage = platformImageMapping["miccai"]
        } else if (item.venue.includes("ACM ")) {
            item.platformImage = platformImageMapping["acm"]
        } else if (item.venue === "Neural Comput. Appl.") {
            item.platformImage = platformImageMapping["springer"]
            item.venue = "Neural Computing and Applications"
        } else if (item.venue === "MIT Press") {
            console.log(item.venue)
            item.platformImage = platformImageMapping["mit press"]
        }

        if (!item.platformImage) {
            // @ts-ignore
            item.platformImage = platformImageMapping[String(item.venue).toLowerCase()]
        }

        if (!item.platformImage && item.ico) item.platformImage = item.ico

        if (!item.platformImage && item.type === "paper") {
            item.platformImage = platformImageMapping["paper"]
        } else if (!item.platformImage && item.type === "book") {
            item.platformImage = platformImageMapping["book"]
        }


        // if (!item.venue) {
        //     item.venue = "Semantic Scholar"
        //     item.platformImage = platformImageMapping[item.venue.toLowerCase()]
        // }

        // if (item.authors.length > 5) {
        //     item.authorsDisplayed = item.authors.slice(0, 5)
        //     item.authorsDisplayed.push(item.authors[item.authors.length - 1])
        //     item.authorsDisplayed.push({ name: '...' })
        // } else {
        //     item.authorsDisplayed = item.authors
        // }

        if (!item.url) {
            if (item.openAccessPdf) {
                item.url = item.openAccessPdf.url
            } else if (item.urls && item.urls.length == 1) {
                item.url = item.urls[0]
            } else if (item.urls && item.urls.length > 1) {
                item.url = item.urls[1]
            }
        }

        if (item.created_at) {
            const year = moment(item.created_at).format("YYYY")
            const currentYear = moment().format("YYYY")
            if (year === currentYear) {
                item.time = moment(item.created_at).format("MMMM")
            } else {
                item.time = year
            }
        }
    })

    return content
}

const showingSideBar = (path: string, user: any) => {
    const pathsToHideSideBar = ['/', '/sign-in', '/onboarding']
    if (pathsToHideSideBar.includes(path)) {
        if (path === '/' && user) {
            return true
        }
        return false
    }
    return true
}

const extractSpotifyShowId = (url: string): string | null => {
    if (url.includes("open.spotify.com/show")) {
        let id = url.split('show/')[1];
        id = id.split('?')[0];
        return id;
    } else {
        console.log(`Unrecognized URL format: ${url}`);
        return null;
    }
} 

const extractItunesPodcastId = (url: string): string | null => {
    if (url.includes("podcasts.apple.com")) {
        let id = url.split('podcast/')[1];
        id = id.split('/id')[1];
        id = id.split('?')[0];
        return id;
    } else {
        console.log(`Unrecognized URL format: ${url}`);
        return null;
    }
}
 
const extractYoutubeChannelIdOrName = (url: string): {id: string | null, name: string | null} => {
    let id = null;
    let name = null;

    if (url.includes("youtube.com/channel")) {
        id = url.split('youtube.com/channel/')[1];
        if (id.includes('/')) {
            id = id.split('/')[0];
        }
        if (id.includes('?')) {
            id = id.split('?')[0];
        }
    } else if (url.includes("youtube.com/c/") || url.includes("youtube.com/@")) {
        name = url.split('youtube.com/')[1];
        if (name.includes('/')) {
            name = name.split('/')[1];
        }
        if (name.includes('?')) {
            name = name.split('?')[0];
        }
    }

    return {id, name};
}

export {
    parseContentForTable,
    platformImageMapping,
    showingSideBar,
    extractSpotifyShowId,
    extractItunesPodcastId,
    extractYoutubeChannelIdOrName
}
