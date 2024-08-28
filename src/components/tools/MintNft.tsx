import { Button, Flex, Form, Input, openToast } from '@near-pagoda/ui';
import { useContext, useEffect, useState } from 'react';
import type { SubmitHandler} from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { NearContext } from '../WalletSelector';

type FormData = {
  title: string;
  description: string;
  image: FileList;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

const MintNft = ({stores}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { wallet, signedAccountId } = useContext(NearContext);
  console.log("🚀 ~ MintNft ~ storesMintbase:", stores)
  const [storeSelected, setStoreSelected] = useState(stores[0]);

  const handleSelectChange = (event) => {
    setStoreSelected(event.target.value);
  };

  const validateImage = (files: FileList) => {
    if (files.length === 0) return 'Image is required';
    const file = files[0];
    if (file.size > MAX_FILE_SIZE) return 'Image size should be less than 5MB';
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Not a valid image format';
    return true;
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!wallet) throw new Error('Wallet has not initialized yet');
    try {
      if (data.image[0]) {
        const res = await fetch(
          "https://ipfs.near.social/add",
          {
            method: "POST",
            headers: { Accept: "application/json" },
            body: data.image[0]
          }
        )
        console.log("🚀 ~ validateImage ~ res:", res)
        const file = await res.json();
        console.log("🚀 ~ validateImage ~ file:", file)
      }
      // const args = {
      //   "owner_id": "maguila.testnet",
      //   "metadata": {
      //     "reference": "s4lMx0LZaApyh_FygAdvRD9YQ0rRuphEt-brA-6mY8Y",
      //     "media": "BM8eCqNQ0nNkaYGR939cZS7-UGjCuenKD3FEIVtqOVI",
      //     "title": "ert"
      //   },
      //   "num_to_mint": 1,
      //   "royalty_args": null,
      //   "split_owners": null
      // }

      // const result = await wallet.signAndSendTransactions({transactions: [{
      //   receiverId: "tkn.near",
      //   actions: [
      //     {
      //       type: 'FunctionCall',
      //       params: {
      //         methodName: 'create_token',
      //         args,
      //         gas: "300000000000000",
      //         deposit: "2234830000000000000000000"
      //       },
      //     },
      //   ],
      // }]});

      // openToast({
      //   type: 'success',
      //   title: 'Form Submitted',
      //   description: 'Your form has been submitted successfully',
      //   duration: 5000,
      // });
    } catch (error) {
      openToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to submit form',
        duration: 5000,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Flex stack gap="l">
        <select value={storeSelected} onChange={handleSelectChange}>>
          {stores.map((store, index) => (
            <option key={index} value={store.name}>{store.name} - {store.origin}</option>
          ))}
        </select>
        <Input
          label="Title"
          placeholder="Enter title"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />
        <Input
          label="Description"
          placeholder="Enter description"
          error={errors.description?.message}
          {...register('description', { required: 'Description is required' })}
        />
        <div style={{display:"flex", flexDirection:"column"}}>
          <label htmlFor="image">Image Upload</label>
          <input
            type="file"
            id="image"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            {...register('image', {
              required: 'Image is required',
              validate: validateImage,
            })}
            onChange={onImageChange}
          />
          {errors.image && <span style={{ color: 'red' }}>{errors.image.message}</span>}
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
          <span style={{ fontSize: '0.8rem', color: 'gray' }}>
            Accepted Formats: PNG, JPEG, GIF, SVG | Ideal dimension: 1:1 | Max size: 5MB
          </span>
        </div>
        <Button label="Mint me" variant="affirmative" type="submit" loading={isSubmitting} />
      </Flex>
    </Form>
  );
};

export default MintNft;
