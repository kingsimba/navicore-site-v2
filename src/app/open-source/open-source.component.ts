import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-open-source',
    templateUrl: './open-source.component.html',
    styleUrls: ['./open-source.component.scss']
})
export class OpenSourceComponent implements OnInit {

    projects = [
        {
            title: 'ncserver',
            description: `A C++ server framework. Suitable for memory/cpu intensive services.
                We use it for Route Server, POI Search Server, etc.`,
            link: 'https://github.com/NavInfoNC/ncserver'
        },
        {
            title: 'nc-geo',
            description: `A collection of algorithms for geometry processing
                (Polygon splitting, finding the largest circle in a polygon, etc.)`,
            link: 'https://github.com/NavInfoNC/nc-geo'
        },
        {
            title: 'json-script',
            description: `A descriptive language to describe JSON data.
                It's very useful to write format specification.`,
            link: 'https://github.com/NavInfoNC/json-script'
        },
        {
            title: 'visual-wrk',
            description: 'Another HTTP load tester. Features HTML based report(including charts), dynamic parameters, etc.',
            link: 'https://github.com/NavInfoNC/visual-wrk'
        },
        {
            title: 'nc-argparse',
            description: 'A C++ command-line argument parser. It supports subcommands, positional arguments, optional arguments and more',
            link: 'https://github.com/NavInfoNC/nc-argparse'
        }
    ];

    more = '<a href="sss">More</a>';

    constructor() { }

    ngOnInit() {
    }

}
