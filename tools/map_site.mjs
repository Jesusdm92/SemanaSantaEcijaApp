import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function mapSite() {
    let html = await fetch('https://tiempocofradedefeastigitana.com/').then(r => r.text());
    let $ = cheerio.load(html);

    const links = new Set();
    $('a').each((i, el) => {
        let href = $(el).attr('href');
        if (href && href.includes('tiempocofradedefeastigitana.com') && !href.includes('wp-content')) {
            links.add(href);
        }
    });

    console.log(Array.from(links));
}

mapSite();
