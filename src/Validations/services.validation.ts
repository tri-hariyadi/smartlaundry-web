import { IServiceAddFormValues } from '@parts/services/ModalAddService';
import { ISubServiceForm } from '@parts/services/ModalAddSubService';
import { IServiceFormValues } from '@parts/services/ModalServiceEdit';

export const ServiceValidation = (values: IServiceFormValues) => {
  const errors: Partial<IServiceFormValues> = {};

  if (!values.name) errors.name = 'Nama servis harus diisi';
  if (!values.desc) errors.desc = 'Deskripsi harus diisi';

  if (values.price === '' || values.price === undefined) {
    errors.price = 'Harga servis harus diisi';
  } else if (values.price) {
    if (isNaN(values.price as number))
      errors.price = 'Harga harus diisi angka';
  }

  if (!values.quantityType) errors.quantityType = 'Satuan servis harus diisi';

  return errors;
};

export const AddServiceValidation = (values: IServiceAddFormValues) => {
  const errors: Partial<IServiceAddFormValues> = {};

  if (!values.name) errors.name = 'Nama servis harus diisi';
  if (!values.desc) errors.desc = 'Deskripsi harus diisi';

  if (values.price === '' || values.price === undefined) {
    errors.price = 'Harga servis harus diisi';
  } else if (values.price) {
    if (isNaN(values.price as number))
      errors.price = 'Harga harus diisi angka';
  }

  if (!values.quantityType) errors.quantityType = 'Satuan servis harus diisi';
  if (!values.image) errors.image = 'Banner laundry harus diupload';

  return errors;
};

export const SubServiceValidation = (values: ISubServiceForm) => {
  const errors: Partial<ISubServiceForm> = {};

  if (!values.name) errors.name = 'Nama sub servis harus diisi';
  if (!values.type) errors.type = 'Tipe servis harus diisi';
  if (!values.price) errors.price = 'Harga harus diisi';
  if (!values.image) errors.image = 'Image harus diupload';

  return errors;
};
