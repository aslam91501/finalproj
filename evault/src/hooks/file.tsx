import axios from 'axios';
import { abi, pinataApiKey } from '../config/vars';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useContract } from './contract';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';

export const useFiles = () => {
  const { id } = useParams();

  const { mutate: uploadFile, status: uploadStatus } = useMutation({
    mutationFn: (file : File) => pinFileToIPFS(file),
    onSuccess: () => {
        toast.success('File Uploaded');

        
    },
    onError: (err) => {
        console.log(err)

        toast.error('Something went wrong', {
            theme: 'colored',
            autoClose: 2000
        })
      },
    })

    const { mutate: updateContract } = useMutation({
      mutationFn: (data: { caseId: string, fileName: string, ipfsHash: string }) => trackFileUpload(data),
      onSuccess: () => {
          toast.success('Contractr Updated');          
      },
      onError: (err) => {
          console.log(err)
  
          toast.error('Something went wrong', {
              theme: 'colored',
              autoClose: 2000
          })
        },
      })

    const pinFileToIPFS = async (file: File) => {
        const formData = new FormData();
      
        const JWT = pinataApiKey;

        formData.append('file', file);
      
        const pinataMetadata = JSON.stringify({
          name: 'File name',
        });
        formData.append('pinataMetadata', pinataMetadata);
      
        const pinataOptions = JSON.stringify({
          cidVersion: 0,
        });
        formData.append('pinataOptions', pinataOptions);
      
        try {
          const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: Infinity,
            headers: {
              'Content-Type': `multipart/form-data;`,
              'Authorization': `Bearer ${JWT}`
            }
          });

          
          console.log(res.data);

          updateContract({ caseId: id!, fileName: file.name, ipfsHash: res.data.IpfsHash })      

        } catch (error) {
          console.error(error);
        }
    };

    const { getContractId } = useContract();


    async function trackFileUpload(data: { caseId: string, fileName: string, ipfsHash: string }) {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      
      const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

      await contract.uploadFile(data.caseId, data.fileName, data.ipfsHash);
  }

  return {
      uploadFile,
      uploadStatus
   }
}

export interface CaseFile{
  name: string;
  ipfsHash: string;
  uploader: string;
}

export const getFiles = () => {
  const {id: caseId} = useParams();

  const { getContractId } = useContract();

  const { data: data, isLoading, isError } = useQuery({
      queryKey: ['getCaseFiles', caseId],
      queryFn: getCaseFiles,
      refetchOnWindowFocus: false
  })

  async function getCaseFiles(){
      const provider = new ethers.BrowserProvider(window.ethereum!);
      
      const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

      const data=  (await contract.getCaseFiles(caseId));

      console.log(data);

      const caseFiles: CaseFile[] = data.map((c: any) => {
        return {
            name: c[0],
            ipfsHash: c[1],
            uploader: c[2]
        }
      })

      return caseFiles;
  }

  return {
      data,
      isLoading,
      isError
  }
}