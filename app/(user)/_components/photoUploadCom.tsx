'use client';
import { deletePhotos, savePhotoUrlsToDB } from '@/actions/user.action';
import LoadingCom from '@/components/ui/loading';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { RxCross1 } from "react-icons/rx";
import { FiLoader, FiMinus } from "react-icons/fi";
import { resizeFile } from '@/util/imageCompress';
import KitImage from '@/components/ui/KitImage';

const PhotoUploadCom = ({ data, isLoading }: { data: { id: string; url: string }[], isLoading: boolean }) => {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string[]>([]);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await savePhotoUrlsToDB(formData);
    },
    onSuccess: () => {
      setFiles([]);
      setPreviews([]);
      queryClient.invalidateQueries({ queryKey: ['fetchUsersProfile'] });
    },

    onError: (error) => {
    },
  });

  const isUploading = uploadMutation?.isPending;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const limit = 6 - (data?.length || 6);
    const newFiles = selectedFiles.slice(0, limit);

    const resizedFiles = await Promise.all(
      newFiles.map((file) => resizeFile(file))
    );

    setFiles((prev) => [...prev, ...resizedFiles]);
    setPreviews((prev) => [
      ...prev,
      ...resizedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemovePreview = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };


  const handleUpload = () => {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    uploadMutation.mutate(formData); // Call mutation
  };


  const existingImages = data || [];
  const totalImagesCount = existingImages?.length + previews?.length;
  const len = Math.max(0, 6 - totalImagesCount);

  const deletPhotoMutation = useMutation({
    mutationFn: async (id: string[]) => {
      return await deletePhotos(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchUsersProfile'] });
    },

    onError: (error) => {
    },
  });
  const handelDelete = async () => {
    if (deleteId.length === 0) {
      toast.error('Please select photos to delete');
      return;
    }
    deletPhotoMutation.mutate(deleteId);
    setDeleteId([]);
    toast.success('deleted successfuly')
    router.refresh()
  }
  const handelChangeDelete = (id: string) => {
    setDeleteId(prev => {
      if (prev.includes(id)) {
        // Remove ID if already selected
        return prev.filter(item => item !== id);
      } else {
        // Add ID if not already selected
        return [...prev, id];
      }
    });
  };

  return (
    <div className='w-full px-5  max-md:px-0 '>
      <h1 className='my-9 ml-4'>
        <p className='font-bold'>Media</p>
        {!existingImages[0]?.url && !isLoading && <div className='border border-yellow-500 center rounded-2xl p-3 bg-yellow-500/20 text-yellow-300 mt-3'> Add atleast 2 photo !! To visible user ⚠️</div>}
      </h1>

      <div className="w-full flex  flex-wrap justify-between px-5 gap-5 max-md:px-2 mt-4">

        {!isLoading ? <>

          {existingImages && existingImages?.map((u: { id: string, url: string }, idx: number) => {
            return (

              <div key={`existing-${idx}`} onClick={() => handelChangeDelete(u?.id)} className='relative max-md:w-[47%] max-md:h-[230px]  w-[200px] h-[300px] rounded-2xl border border-black/20'>
                {deleteId.includes(u?.id) ? <div className=' absolute -top-2 -right-2 buttongreen rounded-full text-lg !p-1 !py-1  '> <FiMinus /> </div>
                  :
                  <div className=' absolute -top-2 -right-2 buttonred rounded-full !p-1 !py-1  '><RxCross1 /></div>
                }
                {/* <Image src={u?.url} alt="Uploaded" height={1000} width={1000} className="  w-full h-full rounded-2xl  object-cover" /> */}
                <KitImage src={u?.url} alt="Uploaded" height={1000} width={1000} className="  w-full h-full rounded-2xl  object-cover" />
              </div>
            )
          })}
          {previews && previews?.map((src, idx) => (
            <div key={idx} className=' relative  max-md:w-[47%] max-md:h-[230px]  w-[200px] h-[300px] rounded-2xl border border-black/20'>
              {!isUploading && <div className=' absolute top-[40%] left-[20%] border border-white/20 text-white text-xs bg-[#ffffff2e] backdrop-blur-sm rounded-full px-3 py-1 z-10'>
                Processing..
              </div>}
              <div onClick={() => handleRemovePreview(idx)} className=' absolute -top-2 -right-2 border-2 border-red-500/50 text-red-500 backdrop-blur-[10px] rounded-full !p-1 !py-1  '><RxCross1 /></div>
              <Image height={1800} width={1500} key={`preview-${idx}`} src={src} alt="Preview" className=" h-full w-full rounded-2xl  object-cover" />
            </div>
          ))}

          {[...Array(len)].map((_, i) => (
            <div key={i} className=' max-md:w-[47%] glass3 max-md:h-[230px]  w-[200px] h-[300px] flex items-center justify-center bg-[#ffffff21] rounded-2xl border-dashed border border-black/20'>
              <button
                className='buttonbg h-10 w-10 flex text-2xl rounded-full items-center justify-center'
                onClick={() => fileInputRef.current?.click()}
              >
                +
              </button>
            </div>
          ))}
        </> :

          <LoadingCom boxes={6} width=" max-md:w-[47%] max-md:h-[230px] !rounded-2xl w-[200px] h-[300px] " margin=" !items-start !justify-between flex py-0 flex-wrap px-5 max-md:px-0 gap-5 flex-row " />
        }
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        hidden={previews.length === 0}
        onClick={handleUpload}
        disabled={isUploading || files.length === 0}
        className="my-10 px-3 py-3 rounded-full w-[300px]  center disable:bg-gray-200  mx-auto block buttonbg text-white"
      >
        {isUploading ? <FiLoader className='text-xl animate-spin ' /> : 'Upload'}

      </button>

      <button
        onClick={() => handelDelete()}
        hidden={deleteId.length === 0}
        disabled={deletPhotoMutation.isPending || deleteId.length === 0}
        className="my-10 px-3 py-3 rounded-full w-[300px]   mx-auto block buttonred text-white"
      >
        {deletPhotoMutation.isPending ? <FiLoader className='text-xl animate-spin ml-2' /> : ' Delete Selected Photos'}
      </button>
    </div>
  );
};

export default PhotoUploadCom;
