import { Product } from "./product";
import { TaxRate } from "./tax-rate";
export declare class ProductTaxRate {
    product_id: string;
    rate_id: string;
    product?: Product;
    tax_rate?: TaxRate;
    created_at: Date;
    updated_at: Date;
    metadata: Record<string, unknown>;
}
/**
 * @schema ProductTaxRate
 * title: "Product Tax Rate"
 * description: "Associates a tax rate with a product to indicate that the product is taxed in a certain way"
 * type: object
 * required:
 *   - created_at
 *   - metadata
 *   - product_id
 *   - rate_id
 *   - updated_at
 * properties:
 *   product_id:
 *     description: The ID of the Product
 *     type: string
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   product:
 *     description: Available if the relation `product` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Product"
 *   rate_id:
 *     description: The ID of the Tax Rate
 *     type: string
 *     example: txr_01G8XDBAWKBHHJRKH0AV02KXBR
 *   tax_rate:
 *     description: Available if the relation `tax_rate` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/TaxRate"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
