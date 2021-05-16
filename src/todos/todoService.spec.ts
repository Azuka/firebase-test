import {TodosService} from "./todoService";

test('get todo single', () => {
    expect(new TodosService().get('a')).not.toBeNull();
});
