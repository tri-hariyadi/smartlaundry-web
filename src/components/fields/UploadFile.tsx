/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, memo, useState } from 'react';
import { FieldInputProps, Field } from 'react-final-form';
import { FormFeedback, Input, FormGroup, Label } from 'reactstrap';
import { InputType } from 'reactstrap/types/lib/Input';
import { FaCloudUploadAlt, FaTimesCircle } from 'react-icons/fa';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Button from '@components/Button';
import compare from '@utils/compare';
import getClass from '@utils/classNames';

export interface FileInfo {
  name: string,
  type: string,
  size: number
  base64: string | ArrayBuffer | null,
  file: File,
}

interface IProps {
  name: string;
  type?: InputType | undefined;
  multiple?: boolean;
  label?: string;
  showPreview?: boolean;
  previewWrapStyle?: React.CSSProperties
  onDone?: (_allFiles: Array<FileInfo>) => void;
}

const UploadFile: React.FC<IProps> = ({
  name,
  type,
  multiple,
  label,
  showPreview,
  previewWrapStyle,
  onDone,
}) => {
  const [dataFiles, setDataFiles] = useState<Array<FileInfo>>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, input: FieldInputProps<any, HTMLElement>) => {
    e.preventDefault();
    const files = e.target.files;
    const allFiles: Array<FileInfo> = [];
    const filesLength = files ? files.length : 0;
    for (let i = 0; i < filesLength; i++) {
      const file = files![i];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000), //kb
          base64: reader.result,
          file: file,
        };
        allFiles.push(fileInfo);
        if (allFiles.length === files!.length) {
          if (onDone) onDone(allFiles);
          input.onChange([...dataFiles, ...allFiles]);
          setDataFiles(v => ([...v, ...allFiles]));
        }
      };
    }
  };

  const nameFiles = () => {
    if (dataFiles.length) {
      return dataFiles.length > 1 ? `${dataFiles.length} File` : dataFiles[0].name;
    }
    return null;
  };

  const openDialog = (input: FieldInputProps<any, HTMLElement>) => {
    const element: HTMLElement = document.querySelector(`#${input.name}`) as HTMLElement;
    element.click();
  };

  const removeFile = (fileBs64: string | ArrayBuffer | null, input: FieldInputProps<any, HTMLElement>) => {
    const newDataFiles: Array<FileInfo> = JSON.parse(JSON.stringify(dataFiles));
    const idx = newDataFiles.findIndex(({ base64 }) => base64 === fileBs64);
    if (idx > -1) {
      newDataFiles.splice(idx, 1);
      setDataFiles(newDataFiles);
      const el: HTMLInputElement = document.querySelector(`#${input.name}`) as HTMLInputElement;
      if (el) el.value='';
      input.onChange(newDataFiles.length ? newDataFiles : null);
    }
  };

  return (
    <Field name={name}>
      {({ input, meta: { error, touched } }) => (
        <FormGroup className='d-flex flex-column align-items-start'>
          {label &&
            <Label className='ms-1' for={input.name}>
              {label}
            </Label>
          }
          <Input
            id={input.name}
            name={input.name}
            type={type}
            multiple={multiple}
            onChange={(e) => handleChange(e, input)}
            invalid={error && touched ? true : false}
            className='d-none'
          />
          <div className='d-flex align-items-center'>
            <Button
              isDisabled={multiple ? false : dataFiles.length === 1}
              onClick={() => openDialog(input)}
              className='btn-sm px-4 me-2' id='OpenImgUpload'>
              <FaCloudUploadAlt className='mt-n1 me-1' style={{ fontSize: '1.2rem' }} /> Upload
            </Button>
            <span>{nameFiles()}</span>
          </div>
          <div className={getClass('upload-img-preview w-100', dataFiles.length ? 'mt-3' : '')}>
            {dataFiles.length && showPreview ?
              dataFiles.map((item) => (
                <span key={item.base64 as string} className='position-relative'
                  style={previewWrapStyle}>
                  <Zoom zoomMargin={10}>
                    <Image src={item.base64 as string}
                      layout='fill' alt='image-preview' />
                  </Zoom>
                  <button onClick={() => removeFile(item.base64, input)} className='remove-img-upload'>
                    <FaTimesCircle />
                  </button>
                </span>
              ))
              : null
            }
          </div>
          {error && touched && <FormFeedback className='ms-1'>{error}</FormFeedback>}
        </FormGroup>
      )}
    </Field>
  );
};

UploadFile.defaultProps = {
  type: 'file',
  multiple: false,
  showPreview: true
};

export default memo(UploadFile, compare);
