import { collectionApi } from "@/application/collections/api/collection.api";
import useCollection from "@/application/collections/hooks/useCollection";
import Back from "@/components/own/Back";
import BasicInfoCard from "@/components/own/collections/BasicInfoCard";
import CollectionProductsCard from "@/components/own/collections/CollectionProductsCard";
import MediaCard from "@/components/own/collections/MediaCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Create() {
  const navigate = useNavigate();
  const {
    collection,
    setCollection,
    updateName,
    products,
    isLoading,
    hasMore,
    loadMore,
    search,
    setSearch,
    toggleProduct,
    isProductSelected,
    reset,
  } = useCollection();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", collection.name);
      formData.append("handle", collection.handle);
      formData.append("description", collection.description);
      formData.append("products", JSON.stringify(collection.products || []));
      if (collection.imageFile instanceof File) {
        formData.append("image", collection.imageFile);
      }
      if (collection.name) {
        await collectionApi.createCollection(formData);
      } else {
        toast.error("Failed to create product , name is required");
        return;
      }

      toast.success("Product created successfully");
      navigate("/collections");
      reset();
    } catch (error) {
      console.error("Create product error:", error);
      toast.error("Failed to create product");
    }
  };
  return (
    <Back>
      <form
        onSubmit={handleSubmit}
        className="lg:grid lg:grid-cols-3 w-full flex flex-col gap-4 xl:px-46"
      >
        <div className="col-span-2 flex flex-col h-full">
          <CollectionProductsCard
            collection={collection}
            search={search}
            setSearch={setSearch}
            products={products}
            toggleProduct={toggleProduct}
            isProductSelected={isProductSelected}
            isLoading={isLoading}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        </div>
        <div className="flex flex-col gap-2">
          <BasicInfoCard
            updateName={updateName}
            collection={collection}
            setCollection={setCollection}
          />
          <MediaCard collection={collection} setCollection={setCollection} />
        </div>
        <div className="lg:col-span-3 w-full flex justify-end sm:pr-24">
          <Button type="submit" className="mt-6 w-[220px]">
            Save Collection
          </Button>
        </div>
      </form>
    </Back>
  );
}
