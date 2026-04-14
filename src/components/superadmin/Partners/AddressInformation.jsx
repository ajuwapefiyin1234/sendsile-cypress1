import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PropTypes from 'prop-types';

const countries = [
  {
    value: 'nigeria',
    label: 'Nigeria',
  },
  {
    value: 'ghana',
    label: 'Ghana',
  },
  {
    value: 'unitedKingdom',
    label: 'United Kingdom',
  },
  {
    value: 'us',
    label: 'United States',
  },
  {
    value: 'kenya',
    label: 'Kenya',
  },
];

const roles = [
  {
    value: 'Partner',
    label: 'partner',
  },
];
const AddressInformation = ({ control }) => {
  return (
    <div className="flex flex-col items-start gap-8 w-full   ">
      <h2 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
        Address Information
      </h2>
      <div className="flex flex-col items-start gap-5 w-full">
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Country
              </FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-[14px]  leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                    <SelectValue
                      className="text-[14px] leading-[19px] text-[#8B909A] placeholder:text-[#8B909A]"
                      placeholder={'Nigeria'}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries?.map((country, index) => (
                    <SelectItem
                      key={country.value}
                      className={`text-[14px] leading-[19px] text-[#8B909A] ${
                        countries.length === index + 1
                          ? ''
                          : 'border-b border-[#ECEEF4]'
                      }`}
                      value={country?.value || ''}
                    >
                      {country?.label || 'NA'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="businessAddress"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                Business Address
              </FormLabel>
              <FormControl className="w-full ">
                <Input
                  className="text-[14px] leading-[20px]  placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                  placeholder="18A Ligali Ayorinde Street, Victoria Island, Lagos State"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="border md:block hidden border-[#ECEEF4] w-full" />

      <div className="flex flex-col items-start gap-8 w-full">
        <h3 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
          Role Assignment
        </h3>

        <div className="flex flex-col items-start gap-5 w-full">
          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Role
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-[14px]  leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                      <SelectValue
                        className="text-[14px] leading-[19px] text-[#8B909A] placeholder:text-[#8B909A]"
                        placeholder={'Select role...'}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles?.map((role, index) => (
                      <SelectItem
                        key={role.value}
                        className={`text-[14px] leading-[19px] text-[#8B909A] ${
                          roles.length === index + 1
                            ? ''
                            : 'border-b border-[#ECEEF4]'
                        }`}
                        value={role?.value || ''}
                      >
                        {role?.label || 'NA'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

AddressInformation.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.object,
};

export default AddressInformation;
