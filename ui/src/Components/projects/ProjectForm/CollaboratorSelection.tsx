import { useEffect, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { ActionMeta } from "react-select";
import { observer } from "mobx-react-lite";

type OptionType =
    {
        label: string;
        value: string;
    };

interface Props
{
    loadOptions: ( inputValue: string ) => Promise<OptionType[]>;
    onChange: ( selected: readonly OptionType[] | null | undefined ) => void;
    value: OptionType[];
}

const CollaboratorSelection = ( { loadOptions, onChange, value }: Props ) =>
{
    const [ selectedOptions, setSelectedOptions ] = useState<readonly OptionType[]>( [] );

    useEffect( () =>
    {
        setSelectedOptions( value );
    }, [ value ] );

    const handleChange = ( newValue: readonly OptionType[] | null | undefined, actionMeta: ActionMeta<OptionType> ) =>
    {
        setSelectedOptions( newValue || [] );
        onChange( newValue || [] );
    };

    return (
        <AsyncCreatableSelect
            isMulti
            onChange={ handleChange }
            loadOptions={ loadOptions }
            value={ selectedOptions }
            isValidNewOption={ () => false }
            noOptionsMessage={ () => null }
            loadingMessage={ () => null }
        />
    );
};

export default observer( CollaboratorSelection );
