import { useState } from "react";
import ProductManageList from "../components/ProductManageList/ProductManageList";
import ProductEditModal from "../components/ProductEditModal/ProductEditModal";
import { useProducts } from "../context/ProductContext";

const Manage = () => {
  const { products, updateProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="font-display-lg text-display-lg text-on-background tracking-tight">
            Gestión de productos
        </h1>
        <div className="flex flex-col gap-4 mt-8 w-full max-w-4xl">
            {products.map((product) => (
                <ProductManageList
                    key={product.id}
                    product={product}
                    onEdit={(id) => setEditingProduct(products.find((p) => p.id === id))}
                    onDelete={(id) => console.log(`Eliminar producto con id: ${id}`)}
                />
            ))}
        </div>
        <div className="mt-8">
            <p className="font-body-md text-body-md text-on-background">
                Aquí puedes agregar más contenido o funcionalidades.
            </p>
        </div>

        {editingProduct && (
          <ProductEditModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={(updated) => {
              updateProduct(updated);
              setEditingProduct(null);
            }}
          />
        )}
    </div>
    );
};

export default Manage;