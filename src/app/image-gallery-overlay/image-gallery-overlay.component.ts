import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-image-gallery-overlay',
  templateUrl: './image-gallery-overlay.component.html',
  styleUrls: ['./image-gallery-overlay.component.css']
})
export class ImageGalleryOverlayComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor() { }

  ngOnInit() {
    this.galleryOptions = [
      { width: '100%' ,"thumbnailsColumns": 3, "thumbnailsRows": 2, "thumbnailsPercent": 40, "imagePercent": 60, "thumbnailMargin": 2, "thumbnailsMargin": 2, "thumbnailsOrder": 2 },

    ];

    this.galleryImages = [
      {
        small: 'assets/car.jpg',
        medium: 'assets/car.jpg',
        big: 'assets/car.jpg'
      },
      {
        small: 'assets/galaxy.jpg',
        medium: 'assets/galaxy.jpg',
        big: 'assets/galaxy.jpg'
      },
      {
        small: 'assets/city.jpg',
        medium: 'assets/city.jpg',
        big: 'assets/city.jpg'
      },
      {
        small: 'assets/galaxy.jpg',
        medium: 'assets/galaxy.jpg',
        big: 'assets/galaxy.jpg'
      },
      {
        small: 'assets/lake.jpg',
        medium: 'assets/lake.jpg',
        big: 'assets/lake.jpg'
      },
      {
        small: 'assets/galaxy.jpg',
        medium: 'assets/galaxy.jpg',
        big: 'assets/galaxy.jpg'
      },
      {
        small: 'assets/waterfall.jpg',
        medium: 'assets/waterfall.jpg',
        big: 'assets/waterfall.jpg'
      },
      {
        small: 'assets/galaxy.jpg',
        medium: 'assets/galaxy.jpg',
        big: 'assets/galaxy.jpg'
      }
    ];
  }

}
