import * as z from "zod";

export const editProductSchema = z
  .object({
    productName: z.string().min(1, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().optional(),
    partner: z.string().optional(),
    description: z.string().optional(),
    product_list: z.string().optional(),
    productImage0: z.custom().optional(),
    productImage1: z.custom().optional(),
    productImage2: z.custom().optional(),
    productImage3: z.custom().optional(),
    productImage4: z.custom().optional(),
    variants: z
      .array(
        z.object({
          variation: z.string().min(1, 'Variation is required'),
          variant_id: z.string().optional(),
          price: z.preprocess(
            (x) => {
              if (typeof x === 'string' && !isNaN(Number(x))) {
                return Number(x);
              }
              return x;
            },
            z.coerce.number().min(1, {
              message: 'Price must be a positive number.',
            })
          ),
          sku: z.string().optional(),
          quantityInStock: z.preprocess(
            (x) => {
              if (typeof x === 'string' && !isNaN(Number(x))) {
                return Number(x);
              }
              return x;
            },
            z.coerce.number().min(1, {
              message: 'Quantity in stock must be a positive number.',
            })
          ),
          productAvailability: z.string().min(1, 'Availability is required'),
          discount: z.boolean().optional(),
          discountType: z.string().optional(),
          discountValue: z
            .preprocess(
              (x) => {
                if (typeof x === 'string' && !isNaN(Number(x))) {
                  return Number(x);
                }
                return x;
              },
              z.coerce.number().min(0, {
                message: 'Discount value must be a positive number.',
              })
            )
            .optional(),
        })
      )
      .min(1, 'At least one variant is required'),
  })
  .refine(
    (data) => {
      return data.variants.every((variant) => {
        // Check for discount requirements
        if (variant.discount) {
          return variant.discountType && variant.discountValue !== undefined;
        }
        return true;
      });
    },
    {
      message:
        'Discount type and value are required when discount is true for a variant.',
      path: ['variants'],
    }
  );
  // Define the validation schema
export const brandSchema = z.object({
  name: z.string().min(1, 'name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.custom().optional(),
});
