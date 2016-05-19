import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];
const IMAGE_DIM = {
  width: 400,
  height: 150
};
const MAX_FILE_SIZE = 128 * 1024;

export class PictureReader {

  constructor(private input:any) {
  }

  read():Observable<string> {
    return Observable.create((sub:Subscriber<string>) => {
      var file = this.input.files[0];
      var reader = new FileReader();

      let onImgLoad = (file, img) => {
        if (!this.isValidDimension(img)) {
          sub.error(('LEAGUES.IMG.INVALID_DIMENSION'));

          return;
        }

        sub.next(reader.result);
      };

      let onLoad = (file) => {
        if (!this.isValidMimeType(file.type)) {
          sub.error('LEAGUES.IMG.INVALID_MIME_TYPE');

          return;
        }
        if (!this.isValidFileSize(file.size)) {
          sub.error(('LEAGUES.IMG.INVALID_FILE_SIZE'));

          return;
        }

        let img = new Image();
        img.src = reader.result;
        img.onload = () => onImgLoad(file, img);
      };

      reader.addEventListener('load', () => onLoad(file));
      if (file) {
        reader.readAsDataURL(file);
      } else {
        sub.error({noFile: true});
      }
    });

  }

  private isValidMimeType(fileType) {
    console.log('picture reader @ validating file type', fileType);

    return IMAGE_MIME_TYPES.indexOf(fileType) !== -1;
  }

  private isValidDimension(img) {
    console.log('picture reader @ validating dimension', img.width, img.height);

    return img.width >= IMAGE_DIM.width && img.height >= IMAGE_DIM.height;
  }

  private isValidFileSize(fileSize) {
    console.log('picture reader @ validating file size', fileSize);

    return fileSize <= MAX_FILE_SIZE;
  }

}
