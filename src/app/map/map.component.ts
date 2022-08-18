import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MapService } from './map.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(private ngZone: NgZone,private service:MapService) {}
  @ViewChild('searchElementRef')
  public searchElementRef!: ElementRef;

  url: string = '';
  map: any;
  zoom = 12;
  latitude!: any;
  longitude!: any;
  ipaddress:string = '';
  isp:string= '';
  city:string = '';
  country:string ='';

  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    scrollwheel: true,
  };

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();
        this.center = {
          lat: this.latitude,
          lng: this.longitude,
        };
      });
    });
  }

  ngOnInit(): void {
this.service.getIpAddress().subscribe((res:any )=> {
  this.ipaddress = res.ip;
  this.service.getGEOLocation(this.ipaddress).subscribe((res:any )=> {
    this.searchElementRef.nativeElement.value =res.city
    this.city = res.city;
          this.country = res.country_code3;
          this.isp = res.isp;
    this.center = {
          lat: +res.latitude,
          lng:+res.longitude,
        };
  });
});
  }
  // url: 'https://googlearchive.github.io/js-v2-samples/ggeoxml/cta.kml',
  // url: 'https://heremaps.github.io/maps-api-for-javascript-examples/display-kml-on-map/data/us-states.kml',
  //url:"https://raw.githubusercontent.com/googlearchive/kml-samples/gh-pages/kml/Placemark/placemark.kml",
  // url:"http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss"
  submit(f: NgForm) {
    this.url = f.controls['kmlUrl'].value;
    f.reset();
  }
  mapReady() {}
}
