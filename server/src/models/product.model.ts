import { Schema, model, Document } from 'mongoose';

export interface IProductVariant {
    sku: string;
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    color: string;
    colorCode?: string; // Mã màu HEX (#000000, #FFFFFF)
    stock: number;
    price: number;
    discountPrice?: number;
}

export interface IProduct extends Document {
    title: string;
    slug: string;
    description: string;
    category: string;
    images: string[];
    isPublished: boolean;
    variants: IProductVariant[];
    createdAt: Date;
    updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>({
    sku: { type: String, required: true, unique: true },
    size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
    color: { type: String, required: true },
    colorCode: { type: String, default: '' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 }
});

const productSchema = new Schema<IProduct>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        category: { type: String, required: true, index: true },
        images: [{ type: String, required: true }],
        isPublished: { type: Boolean, default: true },
        variants: [variantSchema]
    },
    { timestamps: true }
);

// Tạo Index cho tìm kiếm tên sản phẩm và lọc theo danh mục
productSchema.index({ title: 'text', description: 'text' });

export const Product = model<IProduct>('Product', productSchema);