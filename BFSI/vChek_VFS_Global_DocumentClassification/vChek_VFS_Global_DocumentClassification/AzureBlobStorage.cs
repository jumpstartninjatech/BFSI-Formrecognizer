using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bfsi_doc_Identification
{
    class AzureBlobStorage
    {
        private string accountname;
        private string accesskey;
        private string containername;

        public AzureBlobStorage(string AccountName, string AccessKey, string ContainerName)
        {
            accountname = AccountName;
            accesskey = AccessKey;
            containername = ContainerName;
        }

        public string StoreVideoInPublicBlob(byte[] video)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            CloudBlockBlob cblob = cont.GetBlockBlobReference(Guid.NewGuid() + "_" + DateTime.Now.ToString("ddMMyyyy_HHmmss_ffffff") + ".mp4");//name should be unique otherwise override at same name.  
            //cblob.UploadFromStreamAsync(file);
            cblob.UploadFromStream(new MemoryStream(video));
            return cblob.Uri.AbsoluteUri;
        }

        public string StoreImageInPublicBlob(byte[] image)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            CloudBlockBlob cblob = cont.GetBlockBlobReference(Guid.NewGuid() + "_" + DateTime.Now.ToString("ddMMyyyy_HHmmss_ffffff") + ".jpg");//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(image));
            return cblob.Uri.AbsoluteUri;
        }

        public string StoreDataInPublicBlob(byte[] image, string filetype)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            CloudBlockBlob cblob = cont.GetBlockBlobReference(Guid.NewGuid() + "_" + DateTime.Now.ToString("ddMMyyyy_HHmmss_ffffff") + "." + filetype);//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(image));
            return cblob.Uri.AbsoluteUri;
        }

        public string StoreImageInPrivateBlob(byte[] image, string filename)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            string name = filename;
            CloudBlockBlob cblob = cont.GetBlockBlobReference(name);//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(image));
            return name;
        }

        public byte[] DownloadImageFromPublicBlob(string Url)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            CloudBlockBlob cblob = cont.GetBlockBlobReference(Path.GetFileName(Url));//name should be unique otherwise override at same name.  
            MemoryStream ms = new MemoryStream();
            cblob.OpenRead().CopyTo(ms);
            return ms.ToArray();
        }

        public byte[] DownloadImageFromPrivateBlob(string FileName)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            CloudBlockBlob cblob = cont.GetBlockBlobReference(FileName);//name should be unique otherwise override at same name.  
            MemoryStream ms = new MemoryStream();
            cblob.OpenRead().CopyTo(ms);
            return ms.ToArray();
        }

        public string StoreTextInPublicBlob(string text)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            CloudBlockBlob cblob = cont.GetBlockBlobReference(Guid.NewGuid() + "_" + DateTime.Now.ToString("ddMMyyyy_HHmmss_ffffff") + ".txt");//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(Encoding.ASCII.GetBytes(text)));
            return cblob.Uri.AbsoluteUri;
        }

        public string StoreTextInPrivateBlob(string text)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            string name = Guid.NewGuid() + "_" + DateTime.Now.ToString("ddMMyyyy_HHmmss_ffffff") + ".txt";
            CloudBlockBlob cblob = cont.GetBlockBlobReference(name);//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(Encoding.ASCII.GetBytes(text)));
            return name;
        }

        public string DownloadTextFromPublicBlob(string Url)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            CloudBlockBlob cblob = cont.GetBlockBlobReference(Path.GetFileName(Url));//name should be unique otherwise override at same name.  
            return new StreamReader(cblob.OpenRead()).ReadToEnd();
        }

        public string DownloadTextFromPrivateBlob(string FileName)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            CloudBlockBlob cblob = cont.GetBlockBlobReference(FileName);//name should be unique otherwise override at same name.  
            return new StreamReader(cblob.OpenRead()).ReadToEnd();
        }

        public string StoreImageInModelDataCollection(byte[] image, string file_type)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            string name = Guid.NewGuid() + "_" + DateTime.Now.ToString("ddMMyyyy_HHmmss_ffffff") + "." + file_type + "";
            CloudBlockBlob cblob = cont.GetBlockBlobReference(name);//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(image));
            return name;
        }
        public string StoreImageInModelDataCollection(string base64_image, string file_type)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            string name = Guid.NewGuid() + "_" + DateTime.Now.ToString("ddMMyyyy_HHmmss_ffffff") + "." + file_type + "";
            CloudBlockBlob cblob = cont.GetBlockBlobReference(name);//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(Convert.FromBase64String(base64_image)));
            //return name;
            return cblob.Uri.AbsoluteUri;
        }

        public string StoreImageInModelDataCollectionForThumbnail(string base64_image, string file_type)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            string name = Guid.NewGuid() + "_" + DateTime.Now.ToString("ddMMyyyy_HHmmss_ffffff") + "." + file_type + "";
            CloudBlockBlob cblob = cont.GetBlockBlobReference(name);//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(Convert.FromBase64String(base64_image)));
            //return name;
            return cblob.Uri.AbsoluteUri;
        }
    }
}
