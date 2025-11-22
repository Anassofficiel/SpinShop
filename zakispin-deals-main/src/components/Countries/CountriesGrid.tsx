import CountryCard from './CountryCard';

interface Country {
  code: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  flag: string;
  productCount: number;
}

interface CountriesGridProps {
  countries: Country[];
}

const CountriesGrid = ({ countries }: CountriesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
      {countries.map((country) => (
        <CountryCard key={country.code} country={country} />
      ))}
    </div>
  );
};

export default CountriesGrid;
