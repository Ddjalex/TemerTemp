import PropertyFilters from '../PropertyFilters';

export default function PropertyFiltersExample() {
  //todo: remove mock functionality
  const handleFilterChange = (filters: any) => console.log('Filters changed:', filters);
  const handleReset = () => console.log('Filters reset');

  return (
    <div className="p-6 max-w-sm">
      <PropertyFilters 
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </div>
  );
}